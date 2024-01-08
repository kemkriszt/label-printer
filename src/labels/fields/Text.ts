import { Command, PrinterLanguage } from "@/commands"
import LabelField from "./LabelField"
import { PrintConfig } from "../Printable"
import { dotToPoint } from "@/helpers/UnitUtils"

export type TextFieldType = "singleline"|"multiline"

/**
 * Presents a piece of text on the label
 */
export default class Text extends LabelField {
    private readonly content: string
    /**
     * X coordinate in dots
     */
    private readonly x: number
    /**
     * Y coordinate in dots
     */
    private readonly y: number
    /**
     * If true, basic html elements will be interpretted, otherwise the raw string is printed out
     */
    private readonly formatted: boolean
    private fontSize: number = 10
    private font: string = "default"
    private type: TextFieldType = "singleline"
    /**
     * Width of the text. 
     * If set, the text will be clipped to this size
     * If the type is set to multiline, this is where the text is split to a newline
     */
    private width: number|undefined
    /**
     * Height of the text box, if empty and the type is multiline, the box can grow infinitely
     */
    private height: number|undefined
    
    constructor(content: string, x: number, y: number, formatted: boolean = true) {
        super()
        this.content = content
        this.x = x
        this.y = y
        this.formatted = formatted
    }

    /**
     * Sets the field to single line
     * @param width Max width of the text. Leave it undefined to allow the field to grow 
     */
    setSingleLine(width?: number) {
        this.type = "singleline"
        this.width = width
        this.height = undefined
    }

    /**
     * Sets the field to multi line
     * @param width Max width of text before it gets wrapped to a new line
     * @param height Max height of the text box, leave undefined to allow the text box to grow infinitly
     */
    setMultiLine(width: number, height?: number) {
        this.type = "multiline"
        this.width = width
        this.height = height
    }

    /**
     * Set a font to use. 
     * Note: The font name either has to be a built in font on your printer or a font
     * that is registered on the label using 'registerFont'.
     * 
     * @param name Name of the font. Use 'default' to use the default font on any printer you connect
     * @param size Font size in dots
     */
    setFont(name: "default"|string, size: number = 10) {
        this.font = name
        this.fontSize = size
    }

    commandForLanguage(language: PrinterLanguage, config?: PrintConfig): Promise<Command> {
        const fontSize = dotToPoint(this.fontSize, config?.dpi ?? 203)
        return this.commandGeneratorFor(language).text(this.content, this.x, this.y, this.font, fontSize)
    }
}