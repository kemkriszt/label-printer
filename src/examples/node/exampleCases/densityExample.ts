import { labels } from "@/index"
import fs from "fs"
// import QRCode from "@/labels/fields/QRCode"

export default async (density: number): Promise<labels.Label> => {
    const fontName = "roboto"
    const testText = "Decoratiuni Mici 200gr Ingr:zahar, amidon de porumb,sirop de glucoza,ulei vegetal,lapte praf,coloranti,E129,E124,E102,praf vanilie,sare 0.001%.Colorantii pot afecta negativ activitatea si atentia copiilor.Valoare energetica/100g: Calorii 406kcal;Proteine 0g;Grasimi 7.2g;Grasimi saturate 5.5g;Grasimi trans <1g;Glucide 85.4g;Zahar 81.6g;Fibre 3.2g Sodiu 27.8g.A se pastra la loc uscat, la temp:+4-+20C. Expira: 26.12.2026"
    const fontSize = 16
    const textX = 20
    const textY = 0
    const textWidth = 300 - textX

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

    const line = new labels.Line({x: textX, y: textY}, {x: textX+ textWidth, y: textY}, 2)

    text.setFont({name: fontName, size: fontSize})
    text.setMultiLine(textWidth)

    label.add(text)
    label.add(line)

    return label
}
