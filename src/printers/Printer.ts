import { Command, PrinterLanguage } from "@/commands";
import { UsbDevice } from "@/helpers/USBUtils";

/**
 * Base class that encapsulates functionality of all printers
 */
export default abstract class Printer {
    private readonly usbDevice: UsbDevice

    /**
     * Printer language used by the type of printer the subclass represents
     */
    abstract get language(): PrinterLanguage

    constructor(device: UsbDevice) {
        this.usbDevice = device
    }

    /**
     * Writes a command to the printers usb
     * @param command Command to send to the usb
     */
    protected async writeCommand(command: Command): Promise<void> {
        await command.write(this.usbDevice)
    }

    /**
     * Check if the device is indeed a printer
     * @param device 
     */
    static try(_device: UsbDevice): Promise<boolean> {
        throw new Error("try(device:) should be implemented")
    }
}