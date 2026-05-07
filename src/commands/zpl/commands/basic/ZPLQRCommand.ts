import { Rotation } from "@/commands";
import ZPLVisualCommand from "../ZPLVisualCommand";
import ZPLTextCommand from "./ZPLTextCommand";

export default class ZPLQRCommand extends ZPLVisualCommand {
    private readonly content: string
    private readonly magnification: number
    private readonly rotation: Rotation

    constructor(content: string, x: number, y: number, magnification: number, rotation: Rotation = 0) {
        super(x, y)
        this.content = content
        this.magnification = Math.max(1, Math.min(10, Math.round(magnification)))
        this.rotation = rotation
    }

    get commandString(): string {
        const rot = ZPLTextCommand.rotationToZPL(this.rotation)
        return `^FO${this.x},${this.y}^BQ${rot},2,${this.magnification},H^FDMA${this.content}^FS`
    }
}
