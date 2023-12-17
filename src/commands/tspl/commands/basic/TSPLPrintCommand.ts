import TSPLCommand from "../../TSPLCommand";

/**
 * Prints the current image buffer
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLPrintCommand extends TSPLCommand {
    /**
     * The number of set to print.
     */
    private readonly sets: number
    /**
     * The number of copies to print of each set.
     * The difference between a set and a copy is that if you have a counter for example,
     * the counter will be incremented for each set but not for each copy
     */
    private readonly copies: number

    constructor(sets: number, copies: number = 1) {
        super()
        this.sets = sets
        this.copies = copies
    }

    get commandString(): string {
        return `PRINT ${this.sets}, ${this.copies}`
    }
}