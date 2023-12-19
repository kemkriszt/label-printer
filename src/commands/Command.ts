import StringUtils from "@/helpers/StringUtils"

/**
 * Base implementation for all types of command
 * Represents a command to be send to the printer to execute, such as print
 */
export default abstract class Command {
    private stringHelper = new StringUtils()

    /**
     * Returns a string representation of the command
     */
    abstract get commandString(): string

    /**
     * Write the command data to a USB device
     * @param device Device to write to
     */
    async write(device: USBDevice): Promise<void> {
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
    protected async writeString(data: string, device: USBDevice): Promise<void> {
        const bytes = this.stringHelper.toUTF8Array(data)
        await this.writeBytes(bytes, device)
    }

    /**
     * Writes bytes to a device. It will automatically end a command with @see{commandTerminatorBytes}
     * @param data Byte array to send
     * @param device Device to write to
     */
    protected async writeBytes(data: Uint8Array, device: USBDevice): Promise<void> {
        const { endpointNumber } = device.configuration!.interfaces[0].alternate.endpoints[0]
        await device.transferOut(endpointNumber, data)
    }

    /**
     * Write the command terminator to the device
     * @param device 
     */
    protected async terminateCommand(device: USBDevice): Promise<void> {
        await this.writeBytes(this.commandTerminatorBytes, device)
    }
}