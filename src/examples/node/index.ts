import ImageUtils from "@/helpers/ImageUtils"
import { Label } from "@/labels"
import { Line, Text, Image } from "@/labels/fields"
// import QRCode from "@/labels/fields/QRCode"
import { PrinterService } from "@/printers"
import fs from "fs"

export default async () => {
    const printers = await PrinterService.getPrinters()
    // console.log("Printers", printers)

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

        // const qrCodeText = "https://tlprinting.net"

        const text = new Text(testText, textX, textY)
        const line = new Line({x: textX - 5, y: textY}, {x: textX - 5 , y: textY + fontSize * 2 + 2})
        const imageData = await ImageUtils.getBWBitmap("https://firebasestorage.googleapis.com/v0/b/tlprinting-live.appspot.com/o/user%2F1701885792189-favicon.png?alt=media&token=4a7a5940-34d6-416c-ac46-f0c6df3a00e2", 100, 100)
        const image = new Image(qrX, qrY, imageData)
        // const qrcode = new QRCode(qrCodeText, qrX, qrY, textWidth / 2)

        text.setFont({name: fontName, size: fontSize})
        text.setMultiLine(textWidth)

        
        label.add(text, line, image)
    
        await printer.display(label)
        await printer.close()
    }
}