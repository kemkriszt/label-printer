import { UsbDevice } from "@/helpers/USBUtils";
import Command from "./Command";

/**
 * A utility class that helps groupping commands together
 * Should be implemnted with a specific command type to ensure only commands for the same lagnuage are
 * groupped together
 */
export default abstract class CommandGroup<T extends Command> extends Command {
    private commands: T[]

    constructor(commands: T[]) {
        super()
        this.commands = commands
    }

    async write(device: UsbDevice): Promise<void> {
        for (let commandIndex in this.commands) {
            await this.commands[commandIndex].write(device)
        }
    }

    get commandString(): string {
        return ""
    }
}