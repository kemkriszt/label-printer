import { Command, Point, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import RotatableLabelField from "./superClasses/RotatableLabelField";
import { PositionedField } from "./superClasses/interfaces";

export default class QRCode extends RotatableLabelField implements PositionedField {
    private readonly content: string
    private x: number
    private y: number
    private readonly width: number

    constructor(content: string, x: number, y: number, width: number) {
        super()
        this.content = content
        this.x = x
        this.y = y
        this.width = width
    }

    setPosition(position: Point): void {
        this.x = position.x
        this.y = position.y
    }

    getPosition(): Point {
        return { x: this.x, y: this.y }
    }

    async commandForLanguage(language: PrinterLanguage, config?: PrintConfig | undefined): Promise<Command> {
        return await this.commandGeneratorFor(language).qrCode(this.content, this.width, this.x, this.y, this.rotation)
    }
}