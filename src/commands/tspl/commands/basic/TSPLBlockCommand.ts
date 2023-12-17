import { Alignment, Rotation } from "../../types";
import TSPLTextCommand from "./TSPLTextCommand";

export default class TSPLBlockCommand extends TSPLTextCommand {
    private readonly width: number
    private readonly height: number
    private readonly lineSpacing: number

    constructor(content: string, 
                x: number, 
                y: number, 
                width: number,
                height: number,
                font: string, 
                rotation?: Rotation, 
                xMultiplication?: number, 
                yMultiplication?: number, 
                lineSpacing: number = 0,
                alignment?: Alignment) {
        super(content, x, y, font, rotation, xMultiplication, yMultiplication, alignment)
        this.width = width
        this.height = height
        this.lineSpacing = lineSpacing
    }

    get commandString(): string {
        return `BLOCK ${this.x},${this.y},${this.width}, ${this.height},\"${this.font}\",${this.rotatation},${this.xMultiplication},${this.yMultiplication},${this.lineSpacing},${this.alignment},\"${this.content}\"`
    }
}