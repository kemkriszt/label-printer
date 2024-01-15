import { Command, PrinterLanguage } from "@/commands"
import LabelField from "./LabelField"
import { PrintConfig } from "../Printable"
import { dotToPoint } from "@/helpers/UnitUtils"
import CommandGenerator from "@/commands/CommandGenerator"
import { isWhitespace } from "@/helpers/StringUtils"
import { NodeType, parse, HTMLElement, Node } from "node-html-parser"

export type TextFieldType = "singleline"|"multiline"
type Context = {
    language: PrinterLanguage,
    generator: CommandGenerator<any>,
    config?: PrintConfig
}

type TextDecoration = "underline"|"strike"

const BOLD_TAG = "b"
const UNDERLINE_TAG = "u"
const STRIKE_TAG = "s"

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
    private context: Context|undefined = undefined
    private readonly lineSpacing = 1

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
     * Set a font to use as a base. If no formatting is set on the text with a html tag, this will be used 
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

    async commandForLanguage(language: PrinterLanguage, config?: PrintConfig): Promise<Command> {
        this.context = {
            config,
            language,
            generator: this.commandGeneratorFor(language)
        }

        
        let command: Command
        if(this.formatted) {
            command = this.generateFormattedText()
        } else {
            command = this.generatePlainText()
        }
        this.context = undefined
  
        return command
    }

    private generateFormattedText(): Command {
        if(!this.context) throw "context-not-set"
        
        // Starter values
        const rootNode = parse(this.content)
        const { command } = this.generateFormattedRecursive(this.x, this.y, rootNode, this.font, this.fontSize, [])
        return command
    }

    /**
     * Iterats the nodes in a html text and generates text commands for it
     */
    private generateFormattedRecursive(initialX: number, initialY: number, rootNode: Node, font: string, fontSize: number, features: TextDecoration[]): {x: number, y: number, command: Command} {
        if(rootNode.nodeType == NodeType.TEXT_NODE) {
            const result = this.generatePlainTextCore(rootNode.innerText, initialX, initialY, font, fontSize, features)
            return result
        } else {
            const elementNode = rootNode as HTMLElement
            const tag = elementNode.rawTagName

            let commands: Command[] = []
            let currentX = initialX
            let currentY = initialY

            const baseFont = tag == BOLD_TAG ? this.getBoldFont(font) : font
            const baseFontSize = fontSize
            let baseFeatures = [...features]
            
            if(tag == UNDERLINE_TAG) {
                baseFeatures.push("underline")
            } else if(tag == STRIKE_TAG) {
                baseFeatures.push("strike")
            }

            elementNode.childNodes.forEach(node => {
                const {x,y,command} = this.generateFormattedRecursive(currentX, currentY, node, baseFont, baseFontSize, baseFeatures, )
                currentX = x
                currentY = y
                commands.push(command)
            })

            return {
                x: currentX,
                y: currentY,
                command: this.context!.generator.commandGroup(commands)
            }
        }
    }

    /**
     * Generate commands for plain text
     * @param config 
     * @returns 
     */
    private generatePlainText(): Command {
        const {command} = this.generatePlainTextCore(this.content, this.x, this.y, this.font, this.fontSize)
        return command
    }

    /**
     * Generate commands for plain text
     * @param config 
     * @returns 
     */
    private generatePlainTextCore(content: string, initialX: number, initialY: number, font: string, fontSize: number, features: TextDecoration[] = []): {x: number, y: number, command: Command} {
        if(!this.context) throw "context-not-set"

        const textWidhtFunction = (this.context.config?.textWidth ?? this.defaultTextWidth)
        const fullWidth = textWidhtFunction(content, font, fontSize)

        if(this.width) {
            const initialPadding = initialX - this.x
            // Because we may start from further in the row, the first rows width may be smaller
            let rowWidth = this.width - initialPadding

            // We may not start from the begining of the textbox so we have to offset
            // by our current position
            if(fullWidth <= rowWidth) {
                return {
                    x: initialX + fullWidth,
                    y: initialY,
                    command: this.textCommand(content, initialX, initialY, font, fontSize)
                }
            } else {
                const commands: Command[] = []
                
                let x = initialX
                let y = initialY
                let remainingContent = content
                let remainingWidth = fullWidth
                let currentHeight = 0

                let finalX = x
                let finalY = y

                do {
                    // This will be the last row of the text. 
                    if(remainingWidth < rowWidth) {
                        finalX = this.x + remainingWidth
                        finalY = y
                        commands.push(this.textCommand(remainingContent,  x, y, font, fontSize))
                        remainingContent = ""
                    } else {
                        // On how many rows this text would fit
                        let rows = remainingWidth / rowWidth
                        // From the second row, all rows are full width
                        rowWidth = this.width
                        // Which caracter is the last if dividing into the right number of rows
                        let rowEndIndex = Math.floor(remainingContent.length / rows)
                        let originalRowEndIndex = rowEndIndex

                        // This means we have to fit a relatively short text into
                        // a lot of rows which can only happen if the row width is very small
                        // in this case, we have to go to a new line
                        if(rowEndIndex == 0) {
                            x = this.x
                            y += fontSize + this.lineSpacing
                            continue
                        }

                        // Scenario 1: Current index is in a middle of row
                        // I am iron m@n
                        // End this row with the last words last character

                        // Scneraio 2: Current index is space:
                        // I am iron@man
                        // No action, but to simplify code, we threat as scenario 1

                        // Scenario 3: Current index is right before a sapce
                        // I am iro@ man
                        // Start next row from the first latter

                        // Find the end of the last word
                        while(
                            ! (
                                !isWhitespace(remainingContent.charAt(rowEndIndex)) &&
                                (
                                    rowEndIndex == remainingContent.length - 1 ||
                                    isWhitespace(remainingContent.charAt(rowEndIndex + 1))
                                )
                            ) && rowEndIndex > 0
                        ) { rowEndIndex -- }

                        let nextRowStartIndex = rowEndIndex + 1
                        // We didn't find a space, we split the text wherever we land
                        if(rowEndIndex == 0) {
                            rowEndIndex = originalRowEndIndex
                            nextRowStartIndex = originalRowEndIndex + 1
                        } else {
                            while(
                                isWhitespace(remainingContent.charAt(nextRowStartIndex)) && 
                                nextRowStartIndex < remainingContent.length
                            ) { nextRowStartIndex ++ }
                        }

                        const thisRow = remainingContent.substring(0, rowEndIndex + 1)
                        commands.push(this.textCommand(thisRow, x, y, font, fontSize))

                        // Make sure to move the cursor back to the left side of the text box
                        // as we may have started further into the row
                        x = this.x
                        y += fontSize + this.lineSpacing
                        currentHeight = y - this.y
                        remainingContent = remainingContent.substring(nextRowStartIndex)
                        remainingWidth = textWidhtFunction(remainingContent, font, fontSize)
                    }
                } while(
                    // We don't have a height constraint or we are still within bounds 
                    // and there is still content 
                    // and we are supporting multiline
                    (this.height == undefined || (currentHeight + fontSize) <= this.height) &&
                    (remainingContent != "") &&
                    this.type == "multiline"
                )

                return {
                    x: finalX,
                    y: finalY,
                    command: this.context!.generator.commandGroup(commands)
                }
            }
        } else {
            //
            return {
                x: initialX + fullWidth,
                y: initialY,
                command: this.textCommand(content, initialX, initialY, font, fontSize)
            }
        }
    }

    private textCommand(text: string, x: number, y: number, font: string, fontSize: number) {
        const finalFontSize = dotToPoint(fontSize, this.context!.config?.dpi ?? 203)
        const finalFont = this.getFontName(font)
        return this.context!.generator.text(text, x, y, finalFont, finalFontSize)
    }

    /**
     * This function is used to calculate the font size if no
     * print config is provided. This will asume that the font has square characters
     */
    private defaultTextWidth(text: string, _f: string, fontSize: number) {
        return text.length * fontSize
    }

    private getBoldFont(font: string) {
        if(font.includes('-bold')) {
            return font
        } else {
            return `${font}-bold`
        }
    }

    private getFontName(font: string) {
        return `${font}.TTF`
    }
}