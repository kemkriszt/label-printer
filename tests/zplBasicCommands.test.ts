import {
    ZPLSetupCommand,
    ZPLPrintCommand,
    ZPLTextCommand,
    ZPLCustomFontTextCommand,
    ZPLGraphicBoxCommand,
    ZPLGraphicDiagonalCommand,
    ZPLGraphicFieldCommand,
    ZPLBarcodeCommand,
    ZPLQRCommand,
    ZPLDownloadCommand,
} from "@/commands/zpl/commands"

// ── Setup ──────────────────────────────────────────────────────────────────

test("ZPLSetupCommand opens label format with ^XA and ^PW/^LL in dots", () => {
    const cmd = new ZPLSetupCommand(50, 30, 0, "normal", false, "metric", 8, 203)
    const str = cmd.commandString
    expect(str).toContain("^XA")
    expect(str).toContain("^PW")
    expect(str).toContain("^LL")
    expect(str).toContain("^PON")
})

test("ZPLSetupCommand converts mm to dots (203 dpi)", () => {
    // 25.4mm = 1 inch = 203 dots
    const cmd = new ZPLSetupCommand(25.4, 25.4, 0, "normal", false, "metric", 8, 203)
    expect(cmd.commandString).toContain("^PW203")
    expect(cmd.commandString).toContain("^LL203")
})

test("ZPLSetupCommand uses dot values as-is for 'dot' unit system", () => {
    const cmd = new ZPLSetupCommand(400, 300, 0, "normal", false, "dot", 8, 203)
    expect(cmd.commandString).toContain("^PW400")
    expect(cmd.commandString).toContain("^LL300")
})

test("ZPLSetupCommand maps inverse direction to ^POI", () => {
    const cmd = new ZPLSetupCommand(50, 30, 0, "inverse", false, "metric", 8, 203)
    expect(cmd.commandString).toContain("^POI")
})

test("ZPLSetupCommand maps mirror to ^POI", () => {
    const cmd = new ZPLSetupCommand(50, 30, 0, "normal", true, "metric", 8, 203)
    expect(cmd.commandString).toContain("^POI")
})

test("ZPLSetupCommand adds ^LT when offset > 0", () => {
    // 2.54mm ≈ 20 dots at 203 dpi
    const cmd = new ZPLSetupCommand(50, 30, 2.54, "normal", false, "metric", 8, 203)
    expect(cmd.commandString).toContain("^LT")
})

test("ZPLSetupCommand maps density 8 to ^MD1", () => {
    // density=8 → (8/15)*30 - 15 = 16 - 15 = 1
    const cmd = new ZPLSetupCommand(50, 30, 0, "normal", false, "metric", 8, 203)
    expect(cmd.commandString).toContain("^MD1")
})

// ── Print ──────────────────────────────────────────────────────────────────

test("ZPLPrintCommand closes label format with ^XZ", () => {
    const cmd = new ZPLPrintCommand(1, 1)
    expect(cmd.commandString).toContain("^XZ")
})

test("ZPLPrintCommand includes sets and copies", () => {
    expect(new ZPLPrintCommand(2, 3).commandString).toBe("^PQ2,0,3,Y^XZ")
})

// ── Text ───────────────────────────────────────────────────────────────────

test("ZPLTextCommand uses built-in font A0 with correct format", () => {
    const cmd = new ZPLTextCommand("Hello", 10, 20, 30)
    expect(cmd.commandString).toBe("^FO10,20^A0N,30,30^FDHello^FS")
})

test("ZPLTextCommand maps rotations correctly", () => {
    expect(new ZPLTextCommand("x", 0, 0, 10, 0).commandString).toContain("^A0N")
    expect(new ZPLTextCommand("x", 0, 0, 10, 90).commandString).toContain("^A0R")
    expect(new ZPLTextCommand("x", 0, 0, 10, 180).commandString).toContain("^A0I")
    expect(new ZPLTextCommand("x", 0, 0, 10, 270).commandString).toContain("^A0B")
})

test("ZPLCustomFontTextCommand uses ^A@ with font file reference", () => {
    const cmd = new ZPLCustomFontTextCommand("Hello", 10, 20, "f0.TTF", 30)
    expect(cmd.commandString).toBe("^FO10,20^A@N,30,30,R:f0.TTF^FDHello^FS")
})

// ── Lines / Boxes ──────────────────────────────────────────────────────────

test("ZPLGraphicBoxCommand generates ^GB for a horizontal bar", () => {
    const cmd = new ZPLGraphicBoxCommand(10, 20, 100, 5, 5)
    expect(cmd.commandString).toBe("^FO10,20^GB100,5,5,B,0^FS")
})

test("ZPLGraphicDiagonalCommand generates ^GD with R orientation for top-left to bottom-right", () => {
    const cmd = new ZPLGraphicDiagonalCommand({ x: 10, y: 20 }, { x: 110, y: 70 }, 3)
    const str = cmd.commandString
    expect(str).toContain("^GD")
    expect(str).toContain(",R^FS")
})

test("ZPLGraphicDiagonalCommand generates ^GD with L orientation for bottom-left to top-right", () => {
    const cmd = new ZPLGraphicDiagonalCommand({ x: 10, y: 70 }, { x: 110, y: 20 }, 3)
    const str = cmd.commandString
    expect(str).toContain(",L^FS")
})

// ── Bitmap ─────────────────────────────────────────────────────────────────

test("ZPLGraphicFieldCommand generates ^GF with inverted hex-encoded bytes", () => {
    // 2 bytes wide, 1 row: 0xFF, 0x00 → inverted → 0x00, 0xFF → "00FF"
    const bitmap = { width: 2, height: 1, bytes: new Uint8Array([0xFF, 0x00]) }
    const cmd = new ZPLGraphicFieldCommand(bitmap, 5, 10)
    const str = cmd.commandString
    expect(str).toContain("^FO5,10")
    expect(str).toContain("^GFA,2,2,2,")
    expect(str).toContain("00FF")
})

test("ZPLGraphicFieldCommand total bytes = width * height", () => {
    const bitmap = { width: 3, height: 4, bytes: new Uint8Array(12) }
    const cmd = new ZPLGraphicFieldCommand(bitmap, 0, 0)
    expect(cmd.commandString).toContain("^GFA,12,12,3,")
})

// ── Barcode ────────────────────────────────────────────────────────────────

test("ZPLBarcodeCommand generates ^BC for Code 128", () => {
    const cmd = new ZPLBarcodeCommand("12345", 10, 20, "128", 50, 0, "left", 2)
    const str = cmd.commandString
    expect(str).toContain("^FO10,20")
    expect(str).toContain("^BC")
    expect(str).toContain("^FD12345^FS")
})

test("ZPLBarcodeCommand generates ^BE for EAN-13", () => {
    const cmd = new ZPLBarcodeCommand("123456789012", 0, 0, "EAN13", 50, 0, "none", 2)
    expect(cmd.commandString).toContain("^BE")
    expect(cmd.commandString).toContain(",N,")
})

test("ZPLBarcodeCommand generates ^B3 for Code 39", () => {
    const cmd = new ZPLBarcodeCommand("ABC", 0, 0, "39", 50, 0, "none", 2)
    expect(cmd.commandString).toContain("^B3")
})

test("ZPLBarcodeCommand human readable Y maps from non-none", () => {
    const cmd = new ZPLBarcodeCommand("12345", 0, 0, "128", 50, 0, "left", 2)
    expect(cmd.commandString).toContain("Y,N,N")
})

test("ZPLBarcodeCommand human readable N maps from none", () => {
    const cmd = new ZPLBarcodeCommand("12345", 0, 0, "128", 50, 0, "none", 2)
    expect(cmd.commandString).toContain("N,N,N")
})

// ── QR Code ────────────────────────────────────────────────────────────────

test("ZPLQRCommand generates ^BQ with magnification", () => {
    const cmd = new ZPLQRCommand("hello", 10, 20, 5)
    const str = cmd.commandString
    expect(str).toContain("^FO10,20")
    expect(str).toContain("^BQN,2,5")
    expect(str).toContain("^FDMAhello^FS")
})

test("ZPLQRCommand clamps magnification to 1-10", () => {
    expect(new ZPLQRCommand("x", 0, 0, 0).commandString).toContain(",1,")
    expect(new ZPLQRCommand("x", 0, 0, 99).commandString).toContain(",10,")
})

test("ZPLQRCommand maps rotation correctly", () => {
    expect(new ZPLQRCommand("x", 0, 0, 3, 90).commandString).toContain("^BQR")
    expect(new ZPLQRCommand("x", 0, 0, 3, 270).commandString).toContain("^BQB")
})

// ── Download ───────────────────────────────────────────────────────────────

test("ZPLDownloadCommand generates ~DY with hex data", () => {
    const data = new Uint8Array([0xDE, 0xAD])
    const cmd = new ZPLDownloadCommand("f0.TTF", data)
    expect(cmd.commandString).toBe("~DYR:f0.TTF,B,T,2,DEAD")
})

test("ZPLDownloadCommand handles ArrayBuffer input", () => {
    const buf = new Uint8Array([0x00, 0xFF]).buffer
    const cmd = new ZPLDownloadCommand("f1.TTF", buf)
    expect(cmd.commandString).toContain("00FF")
})
