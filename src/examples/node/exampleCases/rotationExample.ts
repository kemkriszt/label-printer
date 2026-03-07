import ImageUtils from "@/helpers/ImageUtils"
import { Label, Text, Image, BarCode, QRCode } from "@/labels"
import { Rotation } from "@/commands/tspl"

const ROTATIONS: Rotation[] = [0, 90, 180, 270]

/**
 * Label 1: The same bitmap shown at all four rotations.
 * An arrow SVG pointing right makes the rotation visually obvious.
 */
async function imageLabel(index: number): Promise<Label> {
    // Arrow pointing right — rotation makes direction immediately obvious
    const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
        <rect width="60" height="60" fill="white"/>
        <polygon points="30,5 55,30 30,55 30,40 5,40 5,20 30,20" fill="black"/>
    </svg>`

    const bitmap = await ImageUtils.getBWBitmap(arrowSvg, 60, 60)

    const label = new Label(50, 50)

    const [x, y] = [100,100]
    const img = new Image(x, y, bitmap)
    img.setRotation(ROTATIONS[index])
    label.add(img)

    return label
}

/**
 * Label 2: Multiline rich text at all four rotations.
 *
 * Quadrant anchors are chosen so each rotation fills its own quadrant on a
 * 300×300 dot canvas without overlap:
 *   0°  (10, 10)    — chars grow right (+x), lines grow down (+y)
 *   90° (160, 140)  — chars grow up (−y),   lines grow right (+x)
 *  180° (140, 290)  — chars grow left (−x),  lines grow up (−y)
 *  270° (290, 160)  — chars grow down (+y),  lines grow left (−x)
 */
async function textLabel(index: number): Promise<Label> {
    const label = new Label(50, 50)

    const content = "<b>Hello</b> <i>World</i><br>Line two<br><u>Line three</u>"
    const fontSize = 14

    const text = new Text(content, 150, 150)
    text.setFont({ name: "default", size: fontSize })
    text.setRotation(ROTATIONS[index])
    label.add(text)

    return label
}

/**
 * Label 3: The same barcode shown at all four rotations.
 * Four quadrants on a 300×300 dot canvas.
 */
async function barcodeLabel(index: number): Promise<Label> {
    const label = new Label(50, 50)

    const [x, y] = [100,100]
    const bc = new BarCode("ROTATE", x, y, "128", 60, 1)
    bc.setRotation(ROTATIONS[index])
    bc.setHumanReadable("center")
    label.add(bc)

    return label
}

/**
 * Label 4: The same QR code shown at all four rotations.
 * Four quadrants on a 200×200 dot canvas.
 */
async function qrCodeLabel(index: number): Promise<Label> {
    const label = new Label(50, 50)

    const [x, y] = [100,100]
    const qr = new QRCode("ROTATE", x, y, 80)
    qr.setRotation(ROTATIONS[index])
    label.add(qr)

    return label
}

export default async (): Promise<Label[]|Label> => {
    return [
        await textLabel(0),
        await textLabel(1),
        await textLabel(2),
        await textLabel(3)
    ];
}
