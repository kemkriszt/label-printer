import { Rotation } from "@/commands";
import { BarcodeHumanReable, BarcodeType } from "@/commands/tspl";
import ZPLVisualCommand from "../ZPLVisualCommand";
import ZPLTextCommand from "./ZPLTextCommand";

export default class ZPLBarcodeCommand extends ZPLVisualCommand {
    private readonly content: string
    private readonly type: BarcodeType
    private readonly height: number
    private readonly rotation: Rotation
    private readonly humanReadable: boolean
    private readonly barWidth: number

    constructor(
        content: string,
        x: number,
        y: number,
        type: BarcodeType,
        height: number,
        rotation: Rotation,
        humanReadable: BarcodeHumanReable,
        barWidth: number
    ) {
        super(x, y)
        this.content = content
        this.type = type
        this.height = Math.round(height)
        this.rotation = rotation
        this.humanReadable = humanReadable !== "none"
        this.barWidth = Math.max(1, Math.round(barWidth))
    }

    get commandString(): string {
        const rot = ZPLTextCommand.rotationToZPL(this.rotation)
        const hr = this.humanReadable ? "Y" : "N"
        const cmd = ZPLBarcodeCommand.zplCommandFor(this.type)
        const params = ZPLBarcodeCommand.paramsFor(this.type, rot, this.height, hr)
        return `^FO${this.x},${this.y}^BY${this.barWidth}${cmd}${params}^FD${this.content}^FS`
    }

    private static zplCommandFor(type: BarcodeType): string {
        switch (type) {
            case "128":
            case "EAN128":   return "^BC"
            case "39":
            case "39C":      return "^B3"
            case "EAN13":
            case "EAN13+2":
            case "EAN13+5":  return "^BE"
            case "EAN8":
            case "EAN8+2":
            case "EAN8+5":   return "^B8"
            case "UPCA":
            case "UPCA+2":
            case "UPCA+5":   return "^BU"
            case "UPCE":
            case "UPCE+2":
            case "UPCE+5":   return "^B9"
            case "93":       return "^BH"
            case "25":
            case "25C":      return "^BI"
            case "ITF14":    return "^BI"
            case "CODA":     return "^BK"
            case "MSI":
            case "MSIC":     return "^BM"
            case "PLESSEY":  return "^BN"
            default:         return "^BC"
        }
    }

    /**
     * Builds the parameter string for a ZPL barcode command.
     * Each ZPL barcode command has a slightly different parameter signature.
     */
    private static paramsFor(type: BarcodeType, rot: string, height: number, hr: string): string {
        switch (type) {
            case "EAN13":
            case "EAN13+2":
            case "EAN13+5":
            case "EAN8":
            case "EAN8+2":
            case "EAN8+5":
                // ^BE/^B8: orientation, height, human_readable, show_check
                return `${rot},${height},${hr},N`
            case "UPCA":
            case "UPCA+2":
            case "UPCA+5":
                // ^BU: orientation, height, human_readable, show_check, guess
                return `${rot},${height},${hr},N,N`
            case "UPCE":
            case "UPCE+2":
            case "UPCE+5":
                // ^B9: orientation, height, human_readable
                return `${rot},${height},${hr}`
            case "39":
            case "39C":
                // ^B3: orientation, check_digit, height, human_readable, guess
                return `${rot},N,${height},${hr},N`
            case "93":
                // ^BH: orientation, height, human_readable, initial_quiet_zone
                return `${rot},${height},${hr},N`
            case "25":
            case "25C":
            case "ITF14":
                // ^BI: orientation, height, human_readable, narrow_bar_width
                return `${rot},${height},${hr}`
            case "128":
            case "EAN128":
            default:
                // ^BC: orientation, height, human_readable, show_check, guess
                return `${rot},${height},${hr},N,N`
        }
    }
}
