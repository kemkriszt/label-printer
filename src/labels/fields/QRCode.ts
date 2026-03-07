import { Command, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import LabelField from "./LabelField";
import { Rotation } from "@/commands/tspl";

export default class QRCode extends LabelField {
    private readonly content: string
    private readonly x: number
    private readonly y: number
    private readonly width: number
    private rotation: Rotation = 0

    constructor(content: string, x: number, y: number, width: number) {
        super()
        this.content = content
        this.x = x
        this.y = y
        this.width = width
    }

    setRotation(rotation: Rotation) {
        this.rotation = rotation
    }

    async commandForLanguage(language: PrinterLanguage, config?: PrintConfig | undefined): Promise<Command> {
        return await this.commandGeneratorFor(language).qrCode(this.content, this.width, this.x, this.y, this.rotation)
    }
}