import { Point, UnitSystem } from "..";
import CommandGenerator from "../CommandGenerator";
import TSPLCommand from "./TSPLCommand";
import { TSPLCLSCommand, TSPLCommandGroup, TSPLDiagonal, TSPLDirectionCommand, TSPLDisplay, TSPLDownload, TSPLGapCommand, TSPLPrintCommand, TSPLRawCommand, TSPLSizeCommand, TSPLTextCommand } from "./commands";
import { LabelDirection } from "./types";

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

    text(content: string, x: number, y: number, font: string|"default", size: number): TSPLCommand {
        const fontName = font == "default" ? "0" : font
        return new TSPLTextCommand(content, x, y, fontName, 0, size, size, "left")
    }

    upload(name: string, data: ArrayBuffer | Uint8Array): TSPLCommand {
        return new TSPLDownload(name, data)
    }

    setUp(width: number, height: number, gap: number, offset: number, direction: LabelDirection, mirror: boolean = false, unitSystem: UnitSystem): TSPLCommand {
        const commands = [
            new TSPLSizeCommand(width, height, unitSystem),
            new TSPLGapCommand(gap, offset, unitSystem),
            new TSPLDirectionCommand(direction, mirror),
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
}

export default new TSPLCommandGenerator()