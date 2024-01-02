import { UnitSystem } from "..";
import CommandGenerator from "../CommandGenerator";
import TSPLCommand from "./TSPLCommand";
import { TSPLCLSCommand, TSPLCommandGroup, TSPLDirectionCommand, TSPLGapCommand, TSPLPrintCommand, TSPLSizeCommand } from "./commands";
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

    setUp(width: number, height: number, gap: number, offset: number, direction: LabelDirection, mirror: boolean = false, unitSystem: UnitSystem): TSPLCommand {
        const commands = [
            new TSPLSizeCommand(width, height, unitSystem),
            new TSPLGapCommand(gap, offset, unitSystem),
            new TSPLDirectionCommand(direction, mirror),
            new TSPLCLSCommand()
        ]

        return new TSPLCommandGroup(commands)
    }
}

export default new TSPLCommandGenerator()