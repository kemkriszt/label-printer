import { Command, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import LabelField from "./LabelField";

export default class QRCode extends LabelField {
    private readonly content: string
    private readonly x: number
    private readonly y: number
    private readonly width: number

    constructor(content: string, x: number, y: number, width: number) {
        super()
        this.content = content
        this.x = x
        this.y = y
        this.width = width
    }

    async commandForLanguage(language: PrinterLanguage, config?: PrintConfig | undefined): Promise<Command> {
        return await this.commandGeneratorFor(language).qrCode(this.content, this.width, this.x, this.y)
    }
}