import { Label } from "@/labels"
import RotatableContainer from "@/labels/RotatableContainer"
import { Text, Table } from "@/labels/fields"

function commandStrings(label: Label) {
    return label.commandForLanguage("tspl").then(cmd => {
        const lines: string[] = []
        cmd.print((c) => lines.push(c))
        return lines
    })
}

function parseTextPosition(line: string): { x: number; y: number } {
    // TSPL TEXT format: TEXT x,y,"font",rotation,xscale,yscale,"content"
    const parts = line.split(",")
    return { x: parseInt(parts[0].replace("TEXT ", "")), y: parseInt(parts[1]) }
}

describe("RotatableContainer", () => {
    test("rotation 0 does not transform field positions", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(0)
        const text = new Text("Hi", 10, 20, false)
        container.add(text)
        label.add(container)

        const lines = await commandStrings(label)
        const textLine = lines.find(l => l.startsWith("TEXT"))!
        const pos = parseTextPosition(textLine)
        expect(pos.x).toBe(10)
        expect(pos.y).toBe(20)
    })

    test("rotation 90 transforms field positions correctly", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(90)
        // adjustPosition for 90: { x: height - y, y: x } = { x: 100 - 20, y: 10 } = { x: 80, y: 10 }
        const text = new Text("Hi", 10, 20, false)
        container.add(text)
        label.add(container)

        const lines = await commandStrings(label)
        const textLine = lines.find(l => l.startsWith("TEXT"))!
        const pos = parseTextPosition(textLine)
        expect(pos.x).toBe(80)
        expect(pos.y).toBe(10)
    })

    test("rotation 180 transforms field positions correctly", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(180)
        // adjustPosition for 180: { x: width - x, y: height - y } = { x: 200 - 10, y: 100 - 20 } = { x: 190, y: 80 }
        const text = new Text("Hi", 10, 20, false)
        container.add(text)
        label.add(container)

        const lines = await commandStrings(label)
        const textLine = lines.find(l => l.startsWith("TEXT"))!
        const pos = parseTextPosition(textLine)
        expect(pos.x).toBe(190)
        expect(pos.y).toBe(80)
    })

    test("rotation 270 transforms field positions correctly", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(270)
        // adjustPosition for 270: { x: y, y: width - x } = { x: 20, y: 200 - 10 } = { x: 20, y: 190 }
        const text = new Text("Hi", 10, 20, false)
        container.add(text)
        label.add(container)

        const lines = await commandStrings(label)
        const textLine = lines.find(l => l.startsWith("TEXT"))!
        const pos = parseTextPosition(textLine)
        expect(pos.x).toBe(20)
        expect(pos.y).toBe(190)
    })

    test("rotation is combined with field's own rotation", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(90)
        const text = new Text("Hi", 10, 20, false)
        text.setRotation(90)
        container.add(text)
        label.add(container)

        const lines = await commandStrings(label)
        // Field rotation 90 + container rotation 90 = 180
        const textLine = lines.find(l => l.startsWith("TEXT"))!
        expect(textLine).toContain("180")
    })

    test("field position is restored after command generation", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(90)
        const text = new Text("Hi", 10, 20, false)
        container.add(text)
        label.add(container)

        await commandStrings(label)

        // Position should be restored after generating commands
        expect(text.getPosition().x).toBe(10)
        expect(text.getPosition().y).toBe(20)
    })

    test("container handles fields without getPosition (e.g. Table) without error", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 400, height: 200 })
        container.setRotation(90)

        const table = new Table(0, 0, [["A"]], {
            size: { width: 60, height: 30 },
            columnWidths: [60],
            rowHeights: [30],
            formatted: false,
        })
        container.add(table)
        label.add(container)

        // Should not throw even though Table has x/y but no getPosition/setPosition
        await expect(commandStrings(label)).resolves.toBeDefined()
    })

    test("multiple fields are all rendered", async () => {
        const label = new Label(100, 100)
        const container = new RotatableContainer({ width: 200, height: 100 })
        container.setRotation(0)
        container.add(new Text("First", 0, 0, false))
        container.add(new Text("Second", 50, 0, false))
        label.add(container)

        const lines = await commandStrings(label)
        expect(lines.filter(l => l.startsWith("TEXT")).length).toBe(2)
    })
})
