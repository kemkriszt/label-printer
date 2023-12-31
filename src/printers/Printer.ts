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

    /**
     * When called, it will feed the labels to the beginig of the next label
     */
    abstract feedLabel(): Promise<void>

    constructor(device: UsbDevice) {
        this.usbDevice = device
    }

    /**
     * Close the printer USB
     */
    async close() {
        await this.usbDevice.close()
    }

    /**
     * Writes a command to the printers usb
     * @param command Command to send to the usb
     */
    async writeCommand(command: Command): Promise<void> {
        if(!this.usbDevice.opened) await this.usbDevice.openAndConfigure()
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