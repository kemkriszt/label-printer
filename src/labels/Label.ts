import { Command, PrinterLanguage } from "@/commands";
import Printable, { PrintConfig } from "./Printable";
import { UnitSystem } from "@/commands";
import { LabelDirection } from "@/commands/tspl";
import LabelField from "./fields/LabelField";
import { Font } from "./types";
import CommandGenerator from "@/commands/CommandGenerator";
import fontkit from "fontkit"
import { dotToPoint, pointsToDots } from "@/helpers/UnitUtils";

/**
 * Holds the content of a label and handles printing
 */
export default class Label extends Printable {
    /**
     * Width of label in dots, mm or inch
     */
    private readonly width: number
    /**
     * Height of label in dots, mm or inch
     */
    private readonly height: number

    /**
     * Units for width, height, gap and offset
     */
    private readonly unitSystem: UnitSystem
    private fonts: Record<string, Font> = {}
    private dpi: number

    /**
    * List of fields on the label
    */
    private fields: LabelField[] = []

    /**
     * Configuration used when generating commands
     */
    get printConfig(): PrintConfig {
        return { 
            dpi: this.dpi,
            textWidth: (text, font, fontSize) => {
                const size = dotToPoint(fontSize, this.dpi)
                const fontObject = this.fonts[font].font
                
                const run = fontObject.layout(text)

                const scaledWidth = size * run.advanceWidth / fontObject.unitsPerEm
                return pointsToDots(scaledWidth, this.dpi)
            }
        } 
    }

    constructor(width: number, height: number, dimensionUnit: UnitSystem = "metric", dpi: number = 203) {
        super()
        this.width = width
        this.height = height
        this.unitSystem = dimensionUnit
        this.dpi = dpi
    }

    async commandForLanguage(language: PrinterLanguage, config?: PrintConfig): Promise<Command> {
        const commandList = await Promise.all(this.fields.map(field => field.commandForLanguage(language, config)))
        return this.commandGeneratorFor(language).commandGroup(commandList)
    }

    /**
     * Place fields to a label
     * @param fields 
     */
    add(...fields: LabelField[]) {
        this.fields.push(...fields)
    }

    /**
     * Register a font to be used. Use the name provided in components to use the font. 
     * For example: textField.setFont('myFont.ttf', 12)
     * @param file Font file. Can be a blob or a url
     * @param name Name to be used to reference the font
     */
    async registerFont(file: ArrayBufferLike|string, name: string) {
        if(typeof file == "string") {
            const resp = await fetch(file)
            file = await resp.arrayBuffer()
        }

        const fontBuffer = Buffer.from(file)
        this.fonts[name] = {name, data: file, font: fontkit.create(fontBuffer)}
    }

    /**
     * Generate a command that is complete for printing
     * @param language Printing language to use
     * @param gap Distance between two labels. It is measured between the two points where the sensor 
     * leaves the label and enters the next one
     * @param direction Direction relative to printing direction. See documentation for more details
     * @param sets Number of sets to print. If you have counters for example, it will not change in a set
     * @param copiesPerSet Number of labels per set
     * @param mirror Mirror the label along the vertical axis
     * @param gapOffset Used with non uniform shaped labels. Is the distance between the point where the sensor leaves the label and the 
     * furthest point of the label in the direction of printing. Check documentation for more info
     * TODO: Is this too TSPL Specific?
     */
    async fullPrintCommand(language: PrinterLanguage, 
                           gap: number, 
                           direction: LabelDirection, 
                           sets: number, 
                           copiesPerSet: number = 1,
                           mirror: boolean = false, 
                           gapOffset: number = 0
                          ): Promise<Command> {

        const generator = this.commandGeneratorFor(language)
        const commands = await this.fullCommand(language, gap, direction, mirror, gapOffset, generator)
        commands.push(generator.print(sets, copiesPerSet))

        return generator.commandGroup(commands)
    }

    /**
     * Generate commands needed to display the label on the printer screen
     * @param language Printing language to use
     * @param direction Direction relative to printing direction. See documentation for more details
     * @param mirror Mirror the label along the vertical axis
     */
    async fullDisplayCommand(language: PrinterLanguage, direction: LabelDirection, mirror: boolean = false) {
        const generator = this.commandGeneratorFor(language)
        const commands = await this.fullCommand(language, 0, direction, mirror, 0, generator)
        commands.push(generator.display())
        
        const group = generator.commandGroup(commands)
        group.print(console.log)
        return group
    }

    /**
     * Helper function that generates common commands for print and display
     */
    private async fullCommand(language: PrinterLanguage, 
                              gap: number,  
                              direction: LabelDirection, 
                              mirror: boolean = false, 
                              gapOffset: number = 0, 
                              generator: CommandGenerator<any>) {
        const commands = [
            ...(Object.values(this.fonts).map((font) => generator.upload(font.name+".TTF", font.data) )),
            generator.setUp(this.width, this.height, gap, gapOffset, direction, mirror, this.unitSystem),
            (await this.commandForLanguage(language, this.printConfig)),
        ]
        return commands
    }
}