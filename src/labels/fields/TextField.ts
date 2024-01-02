import { Command, PrinterLanguage } from "@/commands"
import LabelField from "./LabelField"

/**
 * Presents a piece of text on the label
 */
export default class TextField extends LabelField {
    private readonly content: string
    /**
     * X coordinate in dots
     */
    private readonly x: number
    /**
     * Y coordinate in dots
     */
    private readonly y: number

    constructor(content: string, x: number, y: number) {
        super()
        this.content = content
        this.x = x
        this.y = y
    }

    commandForLanguage(language: PrinterLanguage): Promise<Command> {
        return this.commandGeneratorFor(language).text(this.content, this.x, this.y)
    }
}