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

        const fontName = "super"
        const fontName2 = "mathova"
        const testText = "Hello 4 <b>from</b> <u>the <b>other</b> side</u>"
        const fontSize = 25
        const textX = 10
        const textY = 10

        const font = fs.readFileSync(__dirname+"/"+fontName+".TTF").buffer
        const font2 = fs.readFileSync(__dirname+"/"+fontName2+".TTF").buffer

        const label = new Label(50, 25)

        label.registerFont(font, fontName)
        label.registerFont(font2, fontName2)

        const text = new Text(testText, textX, textY, true)
        // const line = new Line({x: textX, y: textY + fontSize}, {x: textX , y: textY + fontSize})
        const line2 = new Line({x: textX - 5, y: textY + fontSize}, {x: textX - 5, y: textY})

        text.setFont(fontName2, fontSize)
        text.setMultiLine(150)

        
        label.add(text) // line2
    
        await printer.display(label)
        await printer.close()
    }
}