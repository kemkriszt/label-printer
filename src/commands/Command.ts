import Device from "@/helpers/Device"

/**
 * Base implementation for all types of command
 * Represents a command to be send to the printer to execute, such as print
 */
export default abstract class Command {
    /**
     * Returns a string representation of the command
     */
    abstract get commandString(): string

    /**
     * Returns a byte array representation of the command
     * By default, converts commandString to bytes, but can be overridden for commands
     * that include binary data (e.g., images, fonts)
     */
    get commandBytes(): Uint8Array {
        const encoder = new TextEncoder()
        const encoded = encoder.encode(this.commandString)
        const terminator = this.commandTerminatorBytes
        const result = new Uint8Array(encoded.length + terminator.length)
        result.set(encoded, 0)
        result.set(terminator, encoded.length)
        return result
    }

    print(fn: (command: string) => void) {
        fn(this.commandString)
    }

    /**
     * Write the command data to a device
     * @param device Device to write to
     */
    async writeTo(device: Device): Promise<void> {
        await this.writeString(this.commandString, device)
        await this.terminateCommand(device)
    }

    /**
     * Byte representation of a newline
     */
    protected get commandTerminatorBytes(): Uint8Array {
        return new Uint8Array([10])
    }

    /**
     * Writes a string to a device
     * @param data String representation of data
     * @param device Device to write to
     */
    protected async writeString(data: string, device: Device): Promise<void> {
        await device.writeString(data)
    }

    /**
     * Writes bytes to a device. It will automatically end a command with @see{commandTerminatorBytes}
     * @param data Byte array to send
     * @param device Device to write to
     */
    protected async writeBytes(data: Uint8Array|ArrayBuffer, device: Device): Promise<void> {
        await device.writeData(data)
    }

    /**
     * Write the command terminator to the device
     * @param device 
     */
    protected async terminateCommand(device: Device): Promise<void> {
        await this.writeBytes(this.commandTerminatorBytes, device)
    }
}