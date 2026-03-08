import { rotationForOrientation } from "@/labels/types"
import { Label } from "@/labels"
import { Line } from "@/labels/fields"

describe("rotationForOrientation", () => {
    test("normal returns 0", () => {
        expect(rotationForOrientation("normal")).toBe(0)
    })

    test("left returns 90", () => {
        expect(rotationForOrientation("left")).toBe(90)
    })

    test("upside-down returns 180", () => {
        expect(rotationForOrientation("upside-down")).toBe(180)
    })

    test("right returns 270", () => {
        expect(rotationForOrientation("right")).toBe(270)
    })
})

test("Line uses default thickness when not provided", async () => {
    const label = new Label(50, 25)
    label.add(new Line({ x: 0, y: 0 }, { x: 10, y: 10 }))

    const cmd = await label.commandForLanguage("tspl")
    const lines: string[] = []
    cmd.print((c) => lines.push(c))

    expect(lines.some(l => l.startsWith("DIAGONAL"))).toBe(true)
})

test("CommandGroup.commandBytes returns empty array for label with no fields", async () => {
    const label = new Label(50, 25)
    const cmd = await label.commandForLanguage("tspl")
    const bytes = cmd.commandBytes
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(0)
})

test("CommandGroup.commandBytes concatenates bytes from multiple commands", async () => {
    const label = new Label(50, 25)
    label.add(new Line({ x: 0, y: 0 }, { x: 10, y: 0 }, 1))
    label.add(new Line({ x: 0, y: 5 }, { x: 10, y: 5 }, 1))

    const cmd = await label.commandForLanguage("tspl")
    const bytes = cmd.commandBytes
    expect(bytes.length).toBeGreaterThan(0)
})
