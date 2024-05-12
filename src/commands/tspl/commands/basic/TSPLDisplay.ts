import TSPLCommand from "../../TSPLCommand";

export type DisplayType = "CLS"|"IMAGE"|"OFF"

/**
 * Displays the image buffer on the screen
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLDisplay extends TSPLCommand {
    private readonly type: DisplayType

    constructor(type: DisplayType) {
        super()
        this.type = type
    }

    get commandString(): string {
        return `DISPLAY ${this.type}`
    }
}