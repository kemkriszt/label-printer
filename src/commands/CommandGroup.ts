import Device from "@/helpers/Device";
import Command from "./Command";

/**
 * A utility class that helps grouping commands together
 * Should be implemented with a specific command type to ensure only commands for the same language are
 * grouped together
 */
export default abstract class CommandGroup<T extends Command> extends Command {
    private commands: T[]

    constructor(commands: T[]) {
        super()
        this.commands = commands
    }

    print(fn: (command: string) => void) {
        for (let commandIndex in this.commands) {
            this.commands[commandIndex].print(fn)
        }
    }

    async writeTo(device: Device): Promise<void> {
        for (let commandIndex in this.commands) {
            await this.commands[commandIndex].writeTo(device)
        }
    }

    get commandString(): string {
        return this.commands.map(c => c.commandString).join("\n")
    }

    get commandBytes(): Uint8Array {
        if (this.commands.length === 0) {
            return new Uint8Array(0)
        }

        const byteArrays = this.commands.map(c => c.commandBytes)
        const totalLength = byteArrays.reduce((sum, arr) => sum + arr.length, 0)
        const result = new Uint8Array(totalLength)
        let offset = 0

        for (const arr of byteArrays) {
            result.set(arr, offset)
            offset += arr.length
        }

        return result
    }
}