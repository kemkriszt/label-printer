import ImageUtils from "@/helpers/ImageUtils"
import { labels } from "@/index"
import fs from "fs"
// import QRCode from "@/labels/fields/QRCode"

export default async (density: number): Promise<labels.Label> => {
    const fontName = "roboto"
    const testText = "<i>Exciting</i> <s>things</s> are <del>coming</del> to <strike>label-printer</strike>"
    const fontSize = 25
    const textX = 10
    const textY = 10
    const textWidth = 250

    const fontRegular = fs.readFileSync(__dirname+"/../Roboto-Regular.ttf").buffer
    const fontBold = fs.readFileSync(__dirname+"/../Roboto-Bold.ttf").buffer
    const fontItalic = fs.readFileSync(__dirname+"/../Roboto-Italic.ttf").buffer
    const fontBoldItalic = fs.readFileSync(__dirname+"/../Roboto-BoldItalic.ttf").buffer

    const label = new labels.Label(50, 25, "metric", 203, density)

    await label.registerFont({name: fontName, data: fontRegular, weight: 400, style: "normal"})
    await label.registerFont({name: fontName, data: fontBold, weight: 700, style: "normal"})
    await label.registerFont({name: fontName, data: fontItalic, weight: 400, style: "italic"})
    await label.registerFont({name: fontName, data: fontBoldItalic, weight: 700, style: "italic"})

    const text = new labels.Text(testText, textX, textY)

    text.setFont({name: fontName, size: fontSize})
    text.setMultiLine(textWidth)

    label.add(text)

    return label
}
