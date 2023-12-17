import { Alignment, BarcodeHumanReable, BarcodeType, Rotation, alignmentToNumber } from "../../types";
import TSPLVisualCommand from "../TSPLVisualCommand";

export default class TSPLBarcodeCommand extends TSPLVisualCommand {
    private readonly type: BarcodeType
    private readonly height: number
    private readonly rotation: Rotation
    private readonly humanReadable: number
    private readonly narrow: number
    private readonly wide: number
    private readonly alignment: number
    private readonly content: string

    /**
     * @param x X coordinate in dots
     * @param y Y Coordinate in dots
     * @param type Type of the barcode
     * @param height Height of the barcode in dots
     * @param narrow Width of narrow elements in dots
     * @param wide Width of the wide elements in dots
     * @param content Content of the barcode. Supported content depends on the barcode type
     * @param rotation Rotation 
     * @param alignment Alignment of the barcode
     */
    constructor(x: number, 
                y: number, 
                type: BarcodeType, 
                height: number, 
                narrow: number, 
                wide: number,
                content: string,
                rotation: Rotation = 0, 
                humanReadable: BarcodeHumanReable = "left",
                alignment: Alignment = "left") {
        super(x,y)
        this.type = type
        this.height = height
        this.narrow = narrow
        this.wide = wide
        this.content = content
        this.rotation = rotation
        this.humanReadable = TSPLBarcodeCommand.humanReadableValue(humanReadable)
        this.alignment = alignmentToNumber(alignment)
    }
    
    get commandString(): string {
        return `BARCODE ${this.x}, ${this.y}, \"${this.type}\", ${this.height}, ${this.humanReadable},${this.rotation}, ${this.narrow}, ${this.wide},${this.alignment}, \"${this.content}\"`
    }

    private static humanReadableValue(hr: BarcodeHumanReable): number {
        switch (hr) {
            case "none": return 0
            case "left": return 1
            case "center": return 2
            case "right": return 3
        }
    }
}