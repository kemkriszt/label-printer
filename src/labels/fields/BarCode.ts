import { Command, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import LabelField from "./LabelField"
import { Alignment, BarcodeHumanReable, BarcodeType, Rotation } from "@/commands/tspl";

export default class BarCode extends LabelField {
    private readonly content: string
    private readonly x: number
    private readonly y: number
    private readonly type: BarcodeType
    private readonly height: number
    private readonly barWidth: number
    private rotation: Rotation
    private humanReadable: BarcodeHumanReable
    private readonly alignment: Alignment

    /**
     * @param content Content to encode
     * @param x X coordinate in dots
     * @param y Y coordinate in dots
     * @param type Barcode symbology
     * @param height Height of the barcode in dots
     * @param barWidth Width of the narrow bar element in dots. The wide element width is
     *                 calculated automatically based on the symbology's standard ratio.
     */
    constructor(content: string, x: number, y: number, type: BarcodeType, height: number, barWidth: number = 2) {
        super()
        this.content = content
        this.x = x
        this.y = y
        this.type = type
        this.height = height
        this.barWidth = barWidth
        this.rotation = 0
        this.humanReadable = "none"
        this.alignment = "left"
    }

    setRotation(rotation: Rotation) {
        this.rotation = rotation
    }

    setHumanReadable(humanReadable: BarcodeHumanReable) {
        this.humanReadable = humanReadable
    }

    async commandForLanguage(language: PrinterLanguage, _config?: PrintConfig | undefined): Promise<Command> {
        return await this.commandGeneratorFor(language).barCode(this.content, this.x, this.y, this.type, this.height, this.rotation, this.humanReadable, this.alignment, this.barWidth)
    }
}