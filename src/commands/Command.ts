import StringUtils from "@/helpers/StringUtils"
/**
 * Base implementation for all types of command
 * Represents a command to be send to the printer to execute, such as print
 */
export abstract class Command {
    private stringHelper = new StringUtils()

    /**
     * Write the command data to a USB device
     * @param device Device to write to
     */
    abstract write(device: USBDevice): Promise<void>
    /**
     * Returns a string representation of the command
     */
    abstract commandString(): string

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
     * Writes bytes to a device
     * @param data Byte array to send
     * @param device Device to write to
     */
    protected async writeBytes(data: Uint8Array, device: USBDevice): Promise<void> {
        const { endpointNumber } = device.configuration!.interfaces[0].alternate.endpoints[0]
        await device.transferOut(endpointNumber, data)
    }
}