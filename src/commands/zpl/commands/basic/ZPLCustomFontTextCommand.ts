import { Rotation } from "@/commands";
import ZPLVisualCommand from "../ZPLVisualCommand";
import ZPLTextCommand from "./ZPLTextCommand";

export default class ZPLCustomFontTextCommand extends ZPLVisualCommand {
    private readonly content: string
    private readonly fontFile: string
    private readonly size: number
    private readonly rotation: Rotation

    constructor(content: string, x: number, y: number, fontFile: string, size: number, rotation: Rotation = 0) {
        super(x, y)
        this.content = content
        // fontFile is the alias like "f0.TTF"; strip path, keep as device reference
        this.fontFile = fontFile
        this.size = Math.round(size)
        this.rotation = rotation
    }

    get commandString(): string {
        const rot = ZPLTextCommand.rotationToZPL(this.rotation)
        return `^FO${this.x},${this.y}^A@${rot},${this.size},${this.size},R:${this.fontFile}^FD${this.content}^FS`
    }
}
