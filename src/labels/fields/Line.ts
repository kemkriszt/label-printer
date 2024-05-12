import { Command, Point, PrinterLanguage } from "@/commands";
import LabelField from "./LabelField";

/**
 * Draws a line to the screen
 */
export default class Line extends LabelField {
    private readonly start: Point
    private readonly end: Point
    private readonly thickness: number

    /**
     * 
     * @param start Start point of the line. Values are in dots
     * @param end End point of the line. Values are in dots
     * @param thickness Thickness of the line in dots 
     */
    constructor(start: Point, end: Point, thickness: number = 3) {
        super()
        this.start = start
        this.end = end
        this.thickness = thickness
    }

    commandForLanguage(language: PrinterLanguage): Promise<Command> {
        return this.commandGeneratorFor(language).line(this.start, this.end, this.thickness)
    }
}