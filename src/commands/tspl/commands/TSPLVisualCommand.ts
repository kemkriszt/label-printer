import TSPLCommand from "../TSPLCommand";

/**
 * Base for all TSPL commands that have a visual effect on the final label
 */
export default abstract class TSPLVisualCommand extends TSPLCommand {
    protected readonly x: number
    protected readonly y: number

    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
    }
}