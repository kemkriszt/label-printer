import { Label } from "@/labels"
import { Line, Text } from "@/labels/fields"
import { PrinterService } from "@/printers"
import fs from "fs"

export default async () => {
    const printers = await PrinterService.getPrinters()
    console.log("Printers", printers)

    if(printers.length > 0) {
        const printer = printers[0]

        const fontName = "super.TTF"
        const testText = "Hello 4"
        const fontSize = 40
        const textX = 10
        const textY = 10

        const font = fs.readFileSync(__dirname+"/"+fontName).buffer

        const label = new Label(50, 25)
        const text = new Text(testText, textX, textY)
        const line = new Line({x: textX, y: textY + fontSize}, {x: textX + 100, y: textY + fontSize})

        text.setFont(fontName, fontSize)
        label.registerFont(font, fontName)
        label.add(text, line)
    
        await printer.display(label)
        await printer.close()
    }
}