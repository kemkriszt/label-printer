import TSPLCommand from "../../TSPLCommand";

/**
 * Clear the image buffer
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLDensityCommand extends TSPLCommand {
    constructor(private density: number) {
        super()
    }

    get commandString(): string {
        return `DENSITY ${this.density}`
    }
}