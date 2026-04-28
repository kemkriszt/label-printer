import { Label } from "@/labels"
import RotatableContainer from "@/labels/RotatableContainer"
import { Table } from "@/labels/fields"

function commandStrings(label: Label) {
    return label.commandForLanguage("tspl").then(cmd => {
        const lines: string[] = []
        cmd.print((c) => lines.push(c))
        return lines
    })
}

test("Table generates grid lines and cell texts", async () => {
    const label = new Label(50, 25)

    const table = new Table(10, 10, [
        ["A1", "A2"],
        ["B1", "B2"],
    ], {
        size: { width: 200, height: 100 },
        columnWidths: [80, 120],
        rowHeights: [40, 60],
        lineThickness: 2,
        cellPadding: 4,
        formatted: false,
        font: { name: "default", size: 10 }
    })

    label.add(table)

    const lines = await commandStrings(label)

    expect(lines.some(l => l.startsWith("DIAGONAL"))).toBe(true)
    expect(lines.filter(l => l.startsWith("DIAGONAL")).length).toBe(6)

    expect(lines.some(l => l.startsWith("TEXT"))).toBe(true)
    expect(lines.filter(l => l.startsWith("TEXT")).length).toBe(4)
})

test("Table wraps text by limiting cell width", async () => {
    const label = new Label(50, 25)

    const table = new Table(0, 0, [
        ["This is a long text that should wrap"],
    ], {
        size: { width: 60, height: 40 },
        columnWidths: [60],
        rowHeights: [40],
        cellPadding: 2,
        formatted: false,
        font: { name: "default", size: 10 }
    })

    label.add(table)

    const lines = await commandStrings(label)
    expect(lines.filter(l => l.startsWith("TEXT")).length).toBeGreaterThan(1)
})

test("Table rotation=90: TEXT commands carry rotation, grid count unchanged, coordinates rotated", async () => {
    const label = new Label(50, 25)

    const table = new Table(10, 10, [
        ["A1", "A2"],
        ["B1", "B2"],
    ], {
        columnWidths: [80, 120],
        rowHeights: [40, 60],
        lineThickness: 2,
        cellPadding: 4,
        formatted: false,
        font: { name: "default", size: 10 }
    })
    table.setRotation(90)
    label.add(table)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const diagLines = lines.filter(l => l.startsWith("DIAGONAL"))

    expect(textLines.length).toBe(4)
    expect(textLines.every(l => l.includes(",90,"))).toBe(true)
    expect(diagLines.length).toBe(6)
    // Cell (row=0,col=0) anchor: textX=14,textY=14 rotated 90° around (10,10) with totalHeight=100
    // → x = 10+100-(14-10)=106, y = 10+(14-10)=14
    expect(textLines.some(l => l.startsWith("TEXT 106,14,"))).toBe(true)
})

test("Table rotation=180: TEXT commands carry rotation and grid count unchanged", async () => {
    const label = new Label(50, 25)

    const table = new Table(10, 10, [
        ["A1", "A2"],
        ["B1", "B2"],
    ], {
        columnWidths: [80, 120],
        rowHeights: [40, 60],
        lineThickness: 2,
        cellPadding: 4,
        formatted: false,
        font: { name: "default", size: 10 }
    })
    table.setRotation(180)
    label.add(table)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const diagLines = lines.filter(l => l.startsWith("DIAGONAL"))

    expect(textLines.length).toBe(4)
    expect(textLines.every(l => l.includes(",180,"))).toBe(true)
    expect(diagLines.length).toBe(6)
    // Cell (row=0,col=0) anchor: textX=14,textY=14 rotated 180° around (10,10) with totalWidth=200,totalHeight=100
    // → x = 10+200-(14-10)=206, y = 10+100-(14-10)=106
    expect(textLines.some(l => l.startsWith("TEXT 206,106,"))).toBe(true)
})

test("Table inside RotatableContainer: compound rotation applied to TEXT", async () => {
    const label = new Label(50, 25)

    const container = new RotatableContainer({ width: 220, height: 120 })
    container.setRotation(90)

    const table = new Table(10, 10, [["Cell"]], {
        columnWidths: [80],
        rowHeights: [40],
        cellPadding: 4,
        formatted: false,
        font: { name: "default", size: 10 }
    })
    container.add(table)
    label.add(container)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))

    expect(textLines.length).toBe(1)
    // Container adds 90° to table's 0° → TEXT should carry rotation=90
    expect(textLines.every(l => l.includes(",90,"))).toBe(true)
})
