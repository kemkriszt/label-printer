import { Alignment, Rotation, alignmentToNumber } from "../../types";
import TSPLVisualCommand from "../TSPLVisualCommand";

/**
 * Prints a single line text on the label
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLTextCommand extends TSPLVisualCommand {
    /**
     * Name of the font to use. Consult documentation for more info
     */
    protected readonly font: string
    /**
     * Angle of rotation of the text. 0, 90, 180 or 270
     */
    protected readonly rotatation: Rotation
    /**
     * Multiplication of the font size in x axis
     */
    protected readonly xMultiplication: number
    /**
     * Multiplication of the font size in y axis
     */
    protected readonly yMultiplication: number
    /**
     * Text alignment. Left, Center or Right. The default alignmnet is left
     */
    protected readonly alignment: number
    /**
     * Text to print
     */
    protected readonly content: string

    constructor(content: string, x: number, y: number, font: string, rotation?: Rotation, xMultiplication?: number, yMultiplication?: number, alignment?: Alignment) {
        super(x, y)
        this.font = font
        this.rotatation = rotation ?? 0
        this.xMultiplication = xMultiplication ?? 1
        this.yMultiplication = yMultiplication ?? 1
        this.alignment = alignmentToNumber(alignment)
        this.content = content
    }

    get commandString(): string {
        return `TEXT ${this.x},${this.y},\"${this.font}\",${this.rotatation},${this.xMultiplication},${this.yMultiplication},${this.alignment},\"${this.content}\"`
    }
}