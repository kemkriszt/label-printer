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
    private readonly rotation: Rotation
    private readonly humanReadable: BarcodeHumanReable 
    private readonly alignment: Alignment

    constructor(content: string, x: number, y: number, type: BarcodeType, height: number, rotatio: Rotation, humanReadable: BarcodeHumanReable, alignment: Alignment) {
        super()
        this.content = content
        this.x = x
        this.y = y
        this.type = type
        this.height = height
        this.rotation = rotatio
        this.humanReadable = humanReadable
        this.alignment = alignment
    }

    async commandForLanguage(language: PrinterLanguage, config?: PrintConfig | undefined): Promise<Command> {
        return await this.commandGeneratorFor(language).barCode(this.content, this.x, this.y, this.type, this.height, this.rotation, this.humanReadable, this.alignment)
    }
}