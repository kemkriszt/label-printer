import { PrinterService } from "@/printers"

export default async () => {
    const printers = await PrinterService.getPrinters()
    console.log("Printers", printers)

    if(printers.length > 0) {
        const printer = printers[0]
        await printer.feedLabel()
        await printer.close()
    }
}