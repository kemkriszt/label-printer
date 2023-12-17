import TSPLVisualCommand from "../TSPLVisualCommand";

/**
 * Draws a black bar
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLBarCommand extends TSPLVisualCommand {
    /**
     * Width of the bar in dots
     */
    private readonly width: number
    /**
     * Height of the bar in dots
     */
    private readonly height: number

    constructor(x: number, y: number, width: number, height: number) {
        super(x,y)
        this.width = width
        this.height = height
    }

    get commandString(): string {
        return `BAR ${this.x}, ${this.y}, ${this.width}, ${this.height}`
    }
}