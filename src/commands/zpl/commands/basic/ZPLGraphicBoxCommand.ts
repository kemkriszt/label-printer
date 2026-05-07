import ZPLVisualCommand from "../ZPLVisualCommand";

export default class ZPLGraphicBoxCommand extends ZPLVisualCommand {
    private readonly width: number
    private readonly height: number
    private readonly thickness: number

    constructor(x: number, y: number, width: number, height: number, thickness: number) {
        super(x, y)
        this.width = Math.round(width)
        this.height = Math.round(height)
        this.thickness = Math.round(thickness)
    }

    get commandString(): string {
        return `^FO${this.x},${this.y}^GB${this.width},${this.height},${this.thickness},B,0^FS`
    }
}
