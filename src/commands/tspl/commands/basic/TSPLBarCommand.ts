import TSPLVisualCommand from "../TSPLVisualCommand";

/**
 * Draws a black bar
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLBarCommand extends TSPLVisualCommand {
    private readonly width: number
    private readonly height: number

    /**
     * @param x X coordinates in dots
     * @param y  Y coordinates in dots
     * @param width Width of tha bar in dots
     * @param height Height of the bar in dots
     */
    constructor(x: number, y: number, width: number, height: number) {
        super(x,y)
        this.width = width
        this.height = height
    }

    get commandString(): string {
        return `BAR ${this.x}, ${this.y}, ${this.width}, ${this.height}`
    }
}