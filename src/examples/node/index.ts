import { Label } from "@/labels"
import { Line, Text } from "@/labels/fields"
import { PrinterService } from "@/printers"
import fs from "fs"
import { NodeType, parse, HTMLElement } from "node-html-parser"
import fontkit from "fontkit"

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

        const fontRegular = fs.readFileSync(__dirname+"/Roboto-Regular.ttf").buffer
        const fontBold = fs.readFileSync(__dirname+"/Roboto-Bold.ttf").buffer
        const fontItalic = fs.readFileSync(__dirname+"/Roboto-Italic.ttf").buffer
        const fontBoldItalic = fs.readFileSync(__dirname+"/Roboto-BoldItalic.ttf").buffer

        const label = new Label(50, 25)

        label.registerFont({name: fontName, data: fontRegular, weight: 400, style: "normal"})
        label.registerFont({name: fontName, data: fontBold, weight: 700, style: "normal"})
        label.registerFont({name: fontName, data: fontItalic, weight: 400, style: "italic"})
        label.registerFont({name: fontName, data: fontBoldItalic, weight: 700, style: "italic"})

        const text = new Text(testText, textX, textY)
        // const line = new Line({x: textX + textWidth, y: textY}, {x: textX + textWidth , y: textY + 300})

        text.setFont({name: fontName, size: fontSize})
        text.setMultiLine(textWidth)

        
        label.add(text)
    
        await printer.display(label)
        await printer.close()
    }
}