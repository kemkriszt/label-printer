import { BWBitmap } from "@/helpers/ImageUtils";
import { GraphicMode } from "../../types";
import TSPLVisualCommand from "../TSPLVisualCommand";

/**
 * Represents a bitmap command. Can be used to draw an image to the label
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLBitmapCommand extends TSPLVisualCommand {
    /**
     * Bitmap to present. 
     * TSPL only supports black and write printing so this bitmap contains a matrix of 1 (White pixel)
     * and 0 (Black pixel) values
     */
    private readonly bitmap: BWBitmap
    /**
     * Represents the strategy to use when two bitmaps overlap. The final value will be determined by
     * either overwriting the first bitmap's value with the second one or performing an 'or' or 'xor' operation
     * on the values
     */
    private readonly mode: GraphicMode
    

    constructor(bitmap: BWBitmap, x: number, y: number, mode?: GraphicMode) {
        super(x, y);
        this.bitmap = bitmap;
        this.mode = mode ?? "overwrite"
    }

    get commandString(): string {
        const textDecoder = new TextDecoder('utf-8')
        const bytesString = textDecoder.decode(this.bitmap.bytes)

        return `${this.commandWithoutBytes}${bytesString.slice(0,5)}...\n`;
    }

    private get commandWithoutBytes(): string {
        return `BITMAP ${this.x}, ${this.y},${this.bitmap.width},${this.bitmap.height},${this.modeValue},`
    }

    private get modeValue(): 0|1|2 {
        switch (this.mode) {
            case "overwrite": return 0
            case "or": return 1
            case "xor": return 2
        }
    }

    async write(device: USBDevice): Promise<void> {
        await this.writeString(this.commandWithoutBytes, device)
        await this.writeBytes(this.bitmap.bytes, device)
        await this.terminateCommand(device)
    }
}