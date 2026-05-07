import ZPLCommand from "../../ZPLCommand";

export default class ZPLPrintCommand extends ZPLCommand {
    private readonly sets: number
    private readonly copiesPerSet: number

    constructor(sets: number, copiesPerSet: number) {
        super()
        this.sets = sets
        this.copiesPerSet = copiesPerSet
    }

    get commandString(): string {
        return `^PQ${this.sets},0,${this.copiesPerSet},Y^XZ`
    }
}
