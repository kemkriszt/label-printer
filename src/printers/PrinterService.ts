import { UsbDevice, getDevices } from "@/helpers/USBUtils"
import TSPLPrinter from "./TSPLPrinter"
import Printer from "./Printer"

export class PrinterService {
    /**
     * Try each type of printer and return the one that mathces the usb device
     * @param device 
     * @returns 
     */
    static async printerForDevice(device: UsbDevice): Promise<Printer|undefined> {
        const classes = [TSPLPrinter]

        for (const key in classes) {
            if(await classes[key].try(device)) {
                return new classes[key](device)
            }
        }

        return undefined
    }

    /**
     * @returns List of available printers
     */
    static async getPrinters(): Promise<Printer[]> {
        const devices = await getDevices()
        const optionalPrinters = await Promise.all(devices.map(PrinterService.printerForDevice))
        return optionalPrinters.filter(printer => !!printer) as Printer[]
    }
}