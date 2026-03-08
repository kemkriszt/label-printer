import { BitmapLike } from "@/helpers/ImageUtils";
import { Point, UnitSystem } from "..";
import CommandGenerator from "../CommandGenerator";
import TSPLCommand from "./TSPLCommand";
import { TSPLBitmapCommand, TSPLCLSCommand, TSPLCommandGroup, TSPLDensityCommand, TSPLDiagonal, TSPLDirectionCommand, TSPLDisplay, TSPLDownload, TSPLGapCommand, TSPLPrintCommand, TSPLQRCommand, TSPLRawCommand, TSPLSizeCommand, TSPLTextCommand } from "./commands";
import { Alignment, BarcodeHumanReable, BarcodeType, GraphicMode, LabelDirection } from "./types";
import { Rotation } from "@/commands";
import TSPLBarcodeCommand from "./commands/basic/TSPLBarcodeCommand";
import { QRLengthMapping } from "@/helpers/QRCodeUtils";

/**
 * Command generator for tspl commands
 */
class TSPLCommandGenerator implements CommandGenerator<TSPLCommand> {
    commandGroup(commands: TSPLCommand[]) {
        return new TSPLCommandGroup(commands)
    }

    print(sets: number, copiesPerSet: number): TSPLCommand {
        return new TSPLPrintCommand(sets, copiesPerSet)
    }

    text(content: string, x: number, y: number, font: string|"default", size: number, rotation?: Rotation): TSPLCommand {
        const fontName = font == "default" ? "0" : font
        return new TSPLTextCommand(content, x, y, fontName, rotation ?? 0, size, size, "left")
    }

    upload(name: string, data: ArrayBuffer | Uint8Array): TSPLCommand {
        return new TSPLDownload(name, data)
    }

    setUp(
        width: number,
        height: number, 
        gap: number, 
        offset: number, 
        direction: LabelDirection, 
        mirror: boolean = false, 
        unitSystem: UnitSystem, 
        density: number
    ): TSPLCommand {
        const commands = [
            new TSPLSizeCommand(width, height, unitSystem),
            new TSPLGapCommand(gap, offset, unitSystem),
            new TSPLDirectionCommand(direction, mirror),
            new TSPLDensityCommand(density),
            new TSPLCLSCommand()
        ]

        return new TSPLCommandGroup(commands)
    }

    display() {
        return new TSPLCommandGroup([
            new TSPLDisplay("CLS"),
            new TSPLDisplay("IMAGE")
        ])
    }

    line(start: Point, end: Point, thickness: number): TSPLCommand {
        return new TSPLDiagonal(start, end, thickness)
    }
    
    image(image: BitmapLike, x: number, y: number, mode?: GraphicMode | undefined): TSPLCommand {
        return new TSPLBitmapCommand(image, x, y, mode)
    }

    qrCode(content: string, width: number, x: number, y: number, rotation?: Rotation): TSPLCommand {
        const cellCount = this.cellCount(content)
        const cellWidth = Math.round(width / cellCount)
        // We start the content With A to indicate that our data is alphanumeric.
        // Not using auto ensures that we can easily calculate the cell with for a given content
        return new TSPLQRCommand(`A${content}`, x, y, cellWidth, 'H', "M", rotation ?? 0)
    }
    
    barCode(content: string, x: number, y: number, type: BarcodeType, height: number, rotation: Rotation, humanReadable: BarcodeHumanReable, alignment: Alignment, barWidth: number = 2): TSPLCommand {
        const { narrow, wide } = TSPLCommandGenerator.narrowWideFor(type, barWidth)
        return new TSPLBarcodeCommand(x, y, type, height, narrow, wide, content, rotation, humanReadable, alignment)
    }

    /**
     * Calculates the narrow and wide element widths for a barcode type based on the
     * TSPL documentation's standard narrow:wide ratios.
     *
     * Types that only support 1:1 (continuous barcodes like CODE128, EAN, UPC) get
     * narrow === wide. All other types use the 1:3 ratio, which is the industry
     * standard for variable-ratio symbologies (CODE39, ITF14, codabar, MSI…).
     */
    private static narrowWideFor(type: BarcodeType, barWidth: number): { narrow: number; wide: number } {
        switch (type) {
            case "25":
            case "25C":
            case "39":
            case "39C":
            case "93":
            case "CODA":
            case "MSI":
            case "MSIC":
            case "PLESSEY": 
            case "ITF14":
            case "11":
            case "TELEPEN":
            case "TELEPENN":
            case "DPI":
            case "DPL":
                return { narrow: barWidth, wide: 3 * barWidth }
            case "CPOST":
                return { narrow: barWidth, wide: barWidth * 7/3 }
            default:
                return { narrow: barWidth, wide: barWidth }
        }
    }

    private cellCount(content: string): number {
        const limits = Object.keys(QRLengthMapping).map( limit => Number(limit) ).sort((a, b) => a - b)
        const contentLength = content.length

        let i = 0
        while(limits[i] < contentLength && i < limits.length - 1) {
            i ++
        }

        return QRLengthMapping[limits[i] as keyof typeof QRLengthMapping]
    }
}

export default new TSPLCommandGenerator()