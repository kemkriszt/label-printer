import TSPLCommand from "../../TSPLCommand";
import { Point } from "@/commands";

export default class TSPLDiagonal extends TSPLCommand {
    private readonly start: Point
    private readonly end: Point
    private readonly thickness: number

    constructor(start: Point, end: Point, thickness: number = 3) {
        super()
        this.start = start
        this.end = end
        this.thickness = thickness
    }

    get commandString(): string {
        return `DIAGONAL ${this.start.x}, ${this.start.y}, ${this.end.x}, ${this.end.y}, ${this.thickness}`
    }
}