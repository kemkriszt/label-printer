import TSPLCommand from "../../TSPLCommand";

/**
 * This command defines in which direction will the label be printed and wether or not to mirror the image
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLDirectionCommand extends TSPLCommand {
    private readonly direction: 0|1
    private readonly mirror: 0|1

    /**
     * @param direction Controls the orientation of the resulting label compared to the printer
     * @param mirror Controls mirroring relative to the center line of the label perpendicular to the printhead. See the documentsion for examples
     */
    constructor(direction: "normal"|"inverse", mirror?: boolean) {
        super()
        this.direction = direction == "normal" ? 1 : 0
        this.mirror = mirror ? 1 : 0
    }

    get commandString(): string {
        return `DIRECTION ${this.direction}, ${this.mirror}`
    }
}
