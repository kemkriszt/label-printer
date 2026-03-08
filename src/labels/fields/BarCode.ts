import { Command, Point, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import { Alignment, BarcodeHumanReable, BarcodeType } from "@/commands/tspl";
import RotatableLabelField from "./superClasses/RotatableLabelField";
import { PositionedField } from "./superClasses/interfaces";

export default class BarCode extends RotatableLabelField implements PositionedField{
    private readonly content: string
    private x: number
    private y: number
    private readonly type: BarcodeType
    private readonly height: number
    private readonly barWidth: number
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
        this.humanReadable = "none"
        this.alignment = "left"
    }

    setHumanReadable(humanReadable: BarcodeHumanReable) {
        this.humanReadable = humanReadable
    }

    setPosition(position: Point): void {
        this.x = position.x
        this.y = position.y
    }

    getPosition(): Point {
        return { x: this.x, y: this.y }
    }

    async commandForLanguage(language: PrinterLanguage, _config?: PrintConfig | undefined): Promise<Command> {
        return await this.commandGeneratorFor(language).barCode(this.content, this.x, this.y, this.type, this.height, this.rotation, this.humanReadable, this.alignment, this.barWidth)
    }
}