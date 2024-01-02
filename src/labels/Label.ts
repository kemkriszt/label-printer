import { Command, PrinterLanguage } from "@/commands";
import Printable from "./Printable";
import { UnitSystem } from "@/commands";
import { LabelDirection } from "@/commands/tspl";
import LabelField from "./fields/LabelField";

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


    constructor(width: number, height: number, dimensionUnit: UnitSystem = "metric") {
        super()
        this.width = width
        this.height = height
        this.unitSystem = dimensionUnit
    }

    /**
     * List of fields on the label
     */
    private fields: LabelField[] = []

    async commandForLanguage(language: PrinterLanguage): Promise<Command> {
        const commandList = await Promise.all(this.fields.map(field => field.commandForLanguage(language)))
        return this.commandGeneratorFor(language).commandGroup(commandList)
    }

    add(field: LabelField) {
        this.fields.push(field)
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
        const commands = [
            ...generator.setUp(this.width, this.height, gap, gapOffset, direction, mirror, this.unitSystem),
            this.commandForLanguage(language),
            generator.print(sets, copiesPerSet)
        ]

        return generator.commandGroup(commands)
    }
}