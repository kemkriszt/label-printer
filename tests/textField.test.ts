import { Label } from "@/labels"
import { Text } from "@/labels/fields"

function commandStrings(label: Label) {
    return label.commandForLanguage("tspl").then(cmd => {
        const lines: string[] = []
        cmd.print((c) => lines.push(c))
        return lines
    })
}

test("Text unformatted generates single TEXT command", async () => {
    const label = new Label(50, 25)
    const text = new Text("Hello", 10, 10, false)
    label.add(text)

    const lines = await commandStrings(label)
    expect(lines.filter(l => l.startsWith("TEXT"))).toHaveLength(1)
})

test("Text formatted underline/strike generates extra line commands", async () => {
    const label = new Label(50, 25)

    const text = new Text("<u>U</u><s>S</s>", 10, 10, true)
    text.setFont({ name: "default", size: 20 })
    label.add(text)

    const lines = await commandStrings(label)

    // underline and strike are implemented via generator.line => DIAGONAL commands
    expect(lines.some(l => l.startsWith("DIAGONAL"))).toBe(true)
    expect(lines.filter(l => l.startsWith("TEXT")).length).toBeGreaterThanOrEqual(2)
})

test("Text multiline wraps when width is small", async () => {
    const label = new Label(50, 25)

    const text = new Text("This is a long text that should wrap", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(40, 60)
    label.add(text)

    const lines = await commandStrings(label)
    expect(lines.filter(l => l.startsWith("TEXT")).length).toBeGreaterThan(1)
})

test("Text multiline wraps single-char word correctly without overflowing row width", async () => {
    // "a" fits on row 1, "long" starts row 2 — the word boundary at index 0 must be
    // recognised as valid rather than triggering a hard-break that overflows rowWidth.
    // Font size 10 → char width 4 px; row width 8 → "a " is 8 px (fits), "a l" is 12 px (doesn't).
    const label = new Label(50, 100)

    const text = new Text("a long text wraps", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(8, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))

    // Extract row content from each TEXT command
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    // The first row must be exactly "a" — not "a l" which would overflow 20 px
    expect(rowContents[0]).toBe("a")
    // And there must be more than one row
    expect(textLines.length).toBeGreaterThan(1)
})

test("Text formatted supports <p> tags for newlines", async () => {
    const label = new Label(50, 25)

    const text = new Text("<p>First</p><p>Second</p>", 10, 10, true)
    text.setFont({ name: "default", size: 20 })
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    expect(textLines.length).toBeGreaterThanOrEqual(2)

    const ys = textLines.map(l => {
        const match = l.match(/^TEXT\s+\d+,(\d+),/)
        if(!match) throw new Error(`Unexpected TEXT command: ${l}`)
        return Number(match[1])
    })

    // There should be at least two distinct y positions (paragraphs printed on different lines)
    expect(new Set(ys).size).toBeGreaterThanOrEqual(2)
})

test("Text formatted supports <br/> for newlines", async () => {
    const label = new Label(50, 25)

    const text = new Text("Hello<br/>World", 10, 10, true)
    text.setFont({ name: "default", size: 20 })
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    expect(textLines.length).toBeGreaterThanOrEqual(2)

    const ys = textLines.map(l => {
        const match = l.match(/^TEXT\s+\d+,(\d+),/)
        if(!match) throw new Error(`Unexpected TEXT command: ${l}`)
        return Number(match[1])
    })
    expect(new Set(ys).size).toBeGreaterThanOrEqual(2)
})

test("Text formatted <p> ending with <br> does not add an extra newline", async () => {
    const label = new Label(50, 25)

    const text = new Text("<p>First<br/></p><p>Second</p>", 10, 10, true)
    text.setFont({ name: "default", size: 20 })
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    expect(textLines.length).toBeGreaterThanOrEqual(2)

    const ys = textLines.map(l => {
        const match = l.match(/^TEXT\s+\d+,(\d+),/)
        if(!match) throw new Error(`Unexpected TEXT command: ${l}`)
        return Number(match[1])
    }).sort((a,b) => a-b)

    // Expect exactly two y positions (one per paragraph), not three (which would imply a double newline)
    expect(new Set(ys).size).toBe(2)
})

test("Text formatted <p> ending with nested <br> does not add an extra newline", async () => {
    const label = new Label(50, 25)

    const text = new Text("<p>First<i><br/></i></p><p>Second</p>", 10, 10, true)
    text.setFont({ name: "default", size: 20 })
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    expect(textLines.length).toBeGreaterThanOrEqual(2)

    const ys = textLines.map(l => {
        const match = l.match(/^TEXT\s+\d+,(\d+),/)
        if(!match) throw new Error(`Unexpected TEXT command: ${l}`)
        return Number(match[1])
    })

    expect(new Set(ys).size).toBe(2)
})

test("Text multiline breaks at punctuation characters when no space is present", async () => {
    // "abc,def" is 28px wide (7 chars * 4px) but row width is 20px.
    // With punctuation break support, it should break after the comma: "abc," + "def"
    // Without it, the whole word would hard-break at character level.
    const label = new Label(50, 100)

    const text = new Text("abc,def", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(20, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    expect(textLines.length).toBe(2)
    expect(rowContents[0]).toBe("abc,")
    expect(rowContents[1]).toBe("def")
})

test("Text multiline mid-word break fills line better than word boundary", async () => {
    // "foo abcdef ghi" default font size 10 → 4px/char, row width 32
    // "foo abcd" = 32px fits, "foo abcde" = 36px doesn't
    // Word boundary would give "foo" (12px). Mid-word break gives "foo abcd" (32px).
    const label = new Label(50, 100)
    const text = new Text("foo abcdef ghi", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(32, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    expect(rowContents[0]).toBe("foo abcd")
    expect(rowContents[1]).toBe("ef ghi")
})

test("Text multiline mid-word break ensures min 2 chars on next line", async () => {
    // "foo abcde ghi" default font size 10 → 4px/char, row width 32
    // "foo abcd" = 32px fits. Word "abcde" has 4 chars on line, 1 on next → adjust
    // to 3 chars on line, 2 on next: "foo abc" + "de ghi"
    const label = new Label(50, 100)
    const text = new Text("foo abcde ghi", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(32, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    expect(rowContents[0]).toBe("foo abc")
    expect(rowContents[1]).toBe("de ghi")
})

test("Text multiline mid-word break moves word to next line if only 1 char fits", async () => {
    // "foo a..." default font size 10 → 4px/char, row width 20
    // "foo a" = 20px fits. But only 1 char of "abcdef" fits → fall back to word boundary "foo"
    const label = new Label(50, 100)
    const text = new Text("foo abcdef", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(20, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    expect(rowContents[0]).toBe("foo")
})

test("Text multiline no-boundary mid-word break avoids leaving 1 char on next line", async () => {
    // "abcdefgh" default font size 10 → 4px/char, row width 28
    // "abcdefg" = 28px fits. Only "h" (1 char) left → adjust to "abcdef" + "gh"
    const label = new Label(50, 100)
    const text = new Text("abcdefgh", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(28, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    expect(rowContents[0]).toBe("abcdef")
    expect(rowContents[1]).toBe("gh")
})

test("Text multiline prefers space break over earlier punctuation break", async () => {
    // "ab,c de fgh" default font size 10 → 4px/char, row width 20
    // "ab,c " = 20px fits. Walk-back finds space after "c" as word boundary.
    const label = new Label(50, 100)

    const text = new Text("ab,c de fgh", 0, 0, false)
    text.setFont({ name: "default", size: 10 })
    text.setMultiLine(20, 200)
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))
    const rowContents = textLines.map(l => {
        const match = l.match(/"([^"]*)"$/)
        return match ? match[1] : ""
    })

    // Walk-back finds the space after "c" as a traditional word boundary,
    // so the first row is "ab,c" (16px fits in 20px).
    expect(rowContents[0]).toBe("ab,c")
})

test("multiline text with oversized default font wraps using clamped TSPL xmul", async () => {
    // font.size = 40 dots at 203 DPI → dotToPoint(40, 203) = 14 pts (exceeds TSPL 1-10 range)
    // After normalization: clampedPoints = 10, effectiveDots ≈ 28.2 → xmul/ymul = 10
    // Per-char width for wrap = 10; rowWidth = 90 → "Hello World" (110) must wrap
    const label = new Label(50, 100, "metric", 203)
    const text = new Text("Hello World", 0, 0, false)
    text.setFont({ name: "default", size: 40 })
    text.setMultiLine(90, 300)
    label.add(text)

    const command = await label.fullPrintCommand("tspl", 3, "normal", 1)
    const lines: string[] = []
    command.print((c) => lines.push(c))
    const textLines = lines.filter(l => l.startsWith("TEXT"))

    expect(textLines.length).toBeGreaterThan(1)

    for (const line of textLines) {
        const match = line.match(/TEXT \d+,\d+,"0",\d+,(\d+),(\d+),/)
        expect(match).not.toBeNull()
        expect(Number(match![1])).toBe(10) // xmul clamped to 10
        expect(Number(match![2])).toBe(10) // ymul clamped to 10
    }
})

test("Text formatted consecutive <p> tags do not create empty lines", async () => {
    const label = new Label(50, 25)

    const text = new Text("<p>One</p><p>Two</p><p>Three</p>", 10, 10, true)
    text.setFont({ name: "default", size: 20 })
    label.add(text)

    const lines = await commandStrings(label)
    const textLines = lines.filter(l => l.startsWith("TEXT"))

    const ys = textLines.map(l => {
        const match = l.match(/^TEXT\s+\d+,(\d+),/)
        if(!match) throw new Error(`Unexpected TEXT command: ${l}`)
        return Number(match[1])
    })

    // No blank line between paragraphs => should use exactly 3 line y positions
    expect(new Set(ys).size).toBe(3)
})
