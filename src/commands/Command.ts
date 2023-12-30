import { UsbDevice } from "@/helpers/USBUtils"

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
     * Write the command data to a USB device
     * @param device Device to write to
     */
    async write(device: UsbDevice): Promise<void> {
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
    protected async writeString(data: string, device: UsbDevice): Promise<void> {
        await device.writeString(data)
    }

    /**
     * Writes bytes to a device. It will automatically end a command with @see{commandTerminatorBytes}
     * @param data Byte array to send
     * @param device Device to write to
     */
    protected async writeBytes(data: Uint8Array, device: UsbDevice): Promise<void> {
        await device.writeData(data)
    }

    /**
     * Write the command terminator to the device
     * @param device 
     */
    protected async terminateCommand(device: UsbDevice): Promise<void> {
        await this.writeBytes(this.commandTerminatorBytes, device)
    }
}