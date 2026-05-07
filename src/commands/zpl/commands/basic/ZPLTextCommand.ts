import { Rotation } from "@/commands";
import ZPLVisualCommand from "../ZPLVisualCommand";

export default class ZPLTextCommand extends ZPLVisualCommand {
    private readonly content: string
    private readonly size: number
    private readonly rotation: Rotation

    constructor(content: string, x: number, y: number, size: number, rotation: Rotation = 0) {
        super(x, y)
        this.content = content
        this.size = Math.round(size)
        this.rotation = rotation
    }

    get commandString(): string {
        const rot = ZPLTextCommand.rotationToZPL(this.rotation)
        return `^FO${this.x},${this.y}^A0${rot},${this.size},${this.size}^FD${this.content}^FS`
    }

    static rotationToZPL(rotation: Rotation): string {
        switch (rotation) {
            case 0:   return "N"
            case 90:  return "R"
            case 180: return "I"
            case 270: return "B"
        }
    }
}
