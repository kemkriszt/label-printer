import { Label } from "@/labels"
import TextField from "@/labels/fields/TextField"
import { PrinterService } from "@/printers"

export default async () => {
    const printers = await PrinterService.getPrinters()
    console.log("Printers", printers)

    if(printers.length > 0) {
        const printer = printers[0]

        const label = new Label(70, 30)
        const text = new TextField("Hello", 5, 10)
        
        label.add(text)
        await printer.print(label, 1, 3)
        await printer.close()
    }
}