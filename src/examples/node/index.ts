import { Label } from "@/labels"
import { Line, Text } from "@/labels/fields"
import QRCode from "@/labels/fields/QRCode"
import { PrinterService } from "@/printers"
import fs from "fs"

export default async () => {
    const printers = await PrinterService.getPrinters()
    console.log("Printers", printers)

    if(printers.length > 0) {
        const printer = printers[0]

        const fontName = "roboto"
        const testText = "<i>Exciting</i> things are coming to label-printer"
        const fontSize = 25
        const textX = 10
        const textY = 10
        const textWidth = 250

        const qrX = textX
        const qrY = textY + fontSize * 2 + 20

        const fontRegular = fs.readFileSync(__dirname+"/Roboto-Regular.ttf").buffer
        const fontBold = fs.readFileSync(__dirname+"/Roboto-Bold.ttf").buffer
        const fontItalic = fs.readFileSync(__dirname+"/Roboto-Italic.ttf").buffer
        const fontBoldItalic = fs.readFileSync(__dirname+"/Roboto-BoldItalic.ttf").buffer

        const label = new Label(50, 25)

        label.registerFont({name: fontName, data: fontRegular, weight: 400, style: "normal"})
        label.registerFont({name: fontName, data: fontBold, weight: 700, style: "normal"})
        label.registerFont({name: fontName, data: fontItalic, weight: 400, style: "italic"})
        label.registerFont({name: fontName, data: fontBoldItalic, weight: 700, style: "italic"})

        const qrCodeText = "https://tlprinting.net"

        const text = new Text(testText, textX, textY)
        const line = new Line({x: textX - 5, y: textY}, {x: textX - 5 , y: textY + fontSize * 2 + 2})
        const qrcode = new QRCode(qrCodeText, qrX, qrY, textWidth / 2)

        text.setFont({name: fontName, size: fontSize})
        text.setMultiLine(textWidth)

        
        label.add(text, line, qrcode)
    
        await printer.display(label)
        await printer.close()
    }
}