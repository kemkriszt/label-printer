import { Label } from "@/labels"
import { Line, Text } from "@/labels/fields"
import { PrinterService } from "@/printers"
import fs from "fs"
import { NodeType, parse, HTMLElement } from "node-html-parser"
import fontkit from "fontkit"

export default async () => {
    // const rootNode = parse("Some cool text <u>first u <font name='font2'>Other</font> remaining u</u> cool asd <s>asd</s> <font size='12'>qwe<font>")
    //     rootNode.childNodes.forEach(node => {
    //         if(node.nodeType == NodeType.TEXT_NODE) {
    //             console.log("T (", node.innerText, ")")
    //         } else if(node.nodeType == NodeType.ELEMENT_NODE) {
    //             const casted = node as HTMLElement
    //             console.log()
    //             console.log(casted.rawTagName, " ----> ")

    //             casted.childNodes.forEach((element) => {
    //                 if(element.nodeType == NodeType.TEXT_NODE) {
    //                     console.log("T (", element.innerText, ")")
    //                 } else if(element.nodeType == NodeType.ELEMENT_NODE) {
    //                     const casted2 = element as HTMLElement
    //                     console.log(casted2.rawTagName, " (", element.innerText, ")")
    //                 }
    //             })

    //             console.log(casted.rawTagName, " <---- ")
    //             console.log()
    //         }
    //     })

    const printers = await PrinterService.getPrinters()
    console.log("Printers", printers)

    if(printers.length > 0) {
        const printer = printers[0]

        const fontName = "roboto"
        const testText = "Hello 4 <b>from</b> <u>the <b>other</b> <s>side</s></u>"
        const fontSize = 25
        const textX = 10
        const textY = 10

        const fontRegular = fs.readFileSync(__dirname+"/Roboto-Regular.ttf").buffer
        const fontBold = fs.readFileSync(__dirname+"/Roboto-Bold.ttf").buffer

        const label = new Label(50, 25)

        label.registerFont({name: fontName, data: fontRegular, weight: 400, style: "normal"})
        label.registerFont({name: fontName, data: fontBold, weight: 700, style: "normal"})

        const text = new Text(testText, textX, textY)
        // const line = new Line({x: textX, y: textY + fontSize}, {x: textX , y: textY + fontSize})
        const line2 = new Line({x: textX - 5, y: textY + fontSize}, {x: textX - 5, y: textY})

        text.setFont({name: fontName, size: fontSize})
        text.setMultiLine(150)

        
        label.add(text) // line2
    
        await printer.display(label)
        await printer.close()
    }
}