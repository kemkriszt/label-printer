import { PrinterLanguage, TSPLRawCommand } from "@/commands";
import Printer from "./Printer";
import { UsbDevice } from "@/helpers/USBUtils";

export default class TSPLPrinter extends Printer {
    get language(): PrinterLanguage {
        return "tspl"
    }

    static async try(device: UsbDevice): Promise<boolean> {
        const testCommand = new TSPLRawCommand("~!I")
        await testCommand.write(device)

        const response = await device.readString(64)
        // If there is a response, we have a TSPL printer
        return !!response
    }
}