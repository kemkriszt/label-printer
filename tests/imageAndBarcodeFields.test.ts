import { Label } from "@/labels"
import Image from "@/labels/fields/Image"
import BarCode from "@/labels/fields/BarCode"

jest.mock("@/helpers/ImageUtils", () => {
    return {
        __esModule: true,
        default: {
            getBWBitmap: jest.fn(),
        }
    }
})

import ImageUtils from "@/helpers/ImageUtils"

function commandStrings(label: Label) {
    return label.commandForLanguage("tspl").then(cmd => {
        const lines: string[] = []
        cmd.print((c) => lines.push(c))
        return lines
    })
}

test("Image.commandForLanguage uses BITMAP command", async () => {
    const label = new Label(50, 25)

    const image = new Image(1, 2, { width: 1, height: 1, bytes: new Uint8Array([0x41]) })
    label.add(image)

    const lines = await commandStrings(label)
    expect(lines.some(l => l.startsWith("BITMAP"))).toBe(true)
})

test("Image.create calls ImageUtils.getBWBitmap", async () => {
    ;(ImageUtils.getBWBitmap as unknown as jest.Mock).mockResolvedValue({
        width: 2,
        height: 3,
        bytes: new Uint8Array([0x00, 0x01]),
    })

    const img = await Image.create("x", 10, 20, 30, 40)
    expect(ImageUtils.getBWBitmap).toHaveBeenCalledWith("x", 30, 40)

    const label = new Label(50, 25)
    label.add(img)
    const lines = await commandStrings(label)
    expect(lines.some(l => l.startsWith("BITMAP"))).toBe(true)
})

test("BarCode.commandForLanguage generates BARCODE command and respects setters", async () => {
    const label = new Label(50, 25)

    const bc = new BarCode("ABC", 1, 2, "CODE128", 50)
    bc.setRotation(90)
    bc.setHumanReadable("center")
    label.add(bc)

    const lines = await commandStrings(label)
    const barcode = lines.find(l => l.startsWith("BARCODE"))
    expect(barcode).toBeTruthy()
    expect(barcode).toContain('"CODE128"')
    expect(barcode).toContain(',90,')
})

test("BarCode uses 1:1 ratio (narrow === wide) for CODE128", async () => {
    const label = new Label(50, 25)
    label.add(new BarCode("123", 0, 0, "CODE128", 50, 3))
    const lines = await commandStrings(label)
    const barcode = lines.find(l => l.startsWith("BARCODE"))!
    // narrow=3, wide=3
    expect(barcode).toContain(', 3, 3,')
})

test("BarCode uses 1:3 ratio (wide = 3×narrow) for CODE39", async () => {
    const label = new Label(50, 25)
    label.add(new BarCode("ABC", 0, 0, "CODE39", 50, 3))
    const lines = await commandStrings(label)
    const barcode = lines.find(l => l.startsWith("BARCODE"))!
    // narrow=3, wide=9
    expect(barcode).toContain(', 3, 9,')
})

test("BarCode uses 1:3 ratio for ITF14", async () => {
    const label = new Label(50, 25)
    label.add(new BarCode("12345678901234", 0, 0, "ITF14", 50, 2))
    const lines = await commandStrings(label)
    const barcode = lines.find(l => l.startsWith("BARCODE"))!
    // narrow=2, wide=6
    expect(barcode).toContain(', 2, 6,')
})

test("BarCode uses 1:1 ratio for EAN13", async () => {
    const label = new Label(50, 25)
    label.add(new BarCode("5901234123457", 0, 0, "EAN13", 50, 4))
    const lines = await commandStrings(label)
    const barcode = lines.find(l => l.startsWith("BARCODE"))!
    // narrow=4, wide=4
    expect(barcode).toContain(', 4, 4,')
})
