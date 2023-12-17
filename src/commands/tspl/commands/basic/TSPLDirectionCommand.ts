import TSPLCommand from "../../TSPLCommand";

/**
 * This command defines in which direction will the label be printed and wether or not to mirror the image
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLDirectionCommand extends TSPLCommand {
    private readonly direction: 0|1
    private readonly mirror: 0|1

    constructor(direction: "normal"|"inverse", mirror?: boolean) {
        super()
        this.direction = direction == "normal" ? 1 : 0
        this.mirror = mirror ? 1 : 0
    }

    get commandString(): string {
        return `DIRECTION ${this.direction}, ${this.mirror}`
    }
}
