import { Label, Text, Line } from "@/labels"

function makeLabel(content: string, fontSize: number, textWidth: number): Label {
    const label = new Label(60, 100)
    const textX = 10
    const textY = 10

    const text = new Text(content, textX, textY)
    text.setFont({ name: "default", size: fontSize })
    text.setMultiLine(textWidth)

    // Vertical line at the right edge of textWidth to visually confirm where wrapping occurs
    const boundaryLine = new Line(
        { x: textX + textWidth, y: 0 },
        { x: textX + textWidth, y: 1000 }
    )

    label.add(text, boundaryLine)
    return label
}

export default async (): Promise<Label[]> => {
    return [
        // 1: Baseline — normal sentence wraps naturally, size 12
        makeLabel(
            "The quick brown fox jumps over the lazy dog near the old riverbank.",
            12,
            200
        ),

        // 2: Single word longer than the text width (no natural break point), size 12
        makeLabel(
            "Pneumonoultramicroscopicsilicovolcanoconiosis causes respiratory problems.",
            12,
            150
        ),

        // 3: Very narrow column forces a wrap on almost every word, size 10
        makeLabel(
            "Hello world this is a narrow column wrapping test.",
            10,
            60
        ),

        // 4: Large font — only a few words fit per line, size 22
        makeLabel(
            "Large font wraps quickly on every line.",
            22,
            260
        ),

        // 5: Small font — many characters fit before a wrap, size 7
        makeLabel(
            "Small font allows much more text per line before wrapping occurs naturally in this sentence.",
            7,
            260
        ),

        // 6: Hyphenated compound words — hyphens are valid break opportunities, size 12
        makeLabel(
            "state-of-the-art ultra-high-definition color-corrected pre-production rendering-pipeline",
            12,
            180
        ),

        // 7: HTML bold/italic tags that span across a natural wrap point, size 12
        makeLabel(
            "<b>This bold section wraps</b> to a new line and <i>italic continues here</i> for several words.",
            12,
            160
        ),

        // 8: Explicit <br> tags mixed with natural wrapping, size 12
        makeLabel(
            "First line<br>Second line is much longer and will also wrap naturally onto the next<br>Short",
            12,
            200
        ),

        // 9: Dense punctuation — commas and periods land near the wrap boundary, size 14
        makeLabel(
            "Apple, banana, cherry, date, elderberry, fig, grape, honeydew, kiwi, lemon.",
            14,
            190
        ),

        // 10: Numbers, decimals, and symbols — should wrap at spaces not mid-number, size 16
        makeLabel(
            "1234 units x 99.99 EUR = 123,487.26 EUR total invoice amount",
            16,
            230
        ),

        // 11: Very long word appearing in the middle of otherwise normal text, size 12
        makeLabel(
            "I discovered superlongwordthatexceedsthesetwidth right in the middle of this sentence.",
            12,
            160
        ),

        // 12: Multiple consecutive spaces between words, size 12
        makeLabel(
            "word1  word2   word3    word4 word5  end",
            12,
            160
        ),
    ]
}
