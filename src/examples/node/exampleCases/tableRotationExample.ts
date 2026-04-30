import { Label } from "@/labels"
import { Table } from "@/labels/fields"
import { Rotation } from "@/commands"
import fs from "fs"

const ROTATIONS: Rotation[] = [0, 90, 180, 270]

export default async (): Promise<Label[]> => {
    const fontName = "roboto"
    const fontRegular = fs.readFileSync(__dirname + "/../Roboto-Regular.ttf").buffer
    const fontBold = fs.readFileSync(__dirname + "/../Roboto-Bold.ttf").buffer
    const fontItalic = fs.readFileSync(__dirname + "/../Roboto-Italic.ttf").buffer
    const fontBoldItalic = fs.readFileSync(__dirname + "/../Roboto-BoldItalic.ttf").buffer

    const createLabel = async (): Promise<Label> => {
        const label = new Label(20, 45)
        await label.registerFont({ name: fontName, data: fontRegular, weight: 400, style: "normal" })
        await label.registerFont({ name: fontName, data: fontBold, weight: 700, style: "normal" })
        await label.registerFont({ name: fontName, data: fontItalic, weight: 400, style: "italic" })
        await label.registerFont({ name: fontName, data: fontBoldItalic, weight: 700, style: "italic" })
        return label
    }

    const font = { name: fontName, size: 11 }

    return Promise.all(ROTATIONS.map(async (rotation) => {
        const label = await createLabel()
        const table = new Table(10, 10, [
            ["<b>Rotation</b>", `<b>${rotation}°</b>`],
            ["Column A", "Column B"],
            ["Value 1", "Value 2"],
        ], {
            columnWidths: [70, 80],
            rowHeights: [24, 24, 24],
            lineThickness: 2,
            cellPadding: 3,
            formatted: true,
            font
        })
        table.setRotation(rotation)
        label.add(table)
        return label
    }))
}
