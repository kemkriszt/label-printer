import { UnitSystem } from "..";
import Command from "./Command";
import CommandGroup from "./CommandGroup";
import { LabelDirection } from "./tspl";

/**
 * Interface that should be implemented by a command generator object for each language
 */
export default interface CommandGenerator<T extends Command> {
    commandGroup: (commands: T[]) => CommandGroup<T>
    print: (sets: number, copiesPerSet: number) => T
    text: (content: string, x: number, y: number) => T

    /**
     * This should generate the needed commands to set up a label before printing
     */
    setUp: (width: number, height: number, gap: number, offset: number, direction: LabelDirection, mirror: boolean, unitSystem: UnitSystem) => T
}