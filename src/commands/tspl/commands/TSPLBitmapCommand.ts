import { BWBitmap } from "@/helpers/ImageUtils";
import TSPLCommand from "../TSPLCommand";

/**
 * Represents a bitmap command. Can be used to draw an image to the label
 */
export default class TSPLBitmapCommand extends TSPLCommand {
    private readonly bitmap: BWBitmap
    private readonly x: number
    private readonly y: number

    constructor(bitmap: BWBitmap, x: number, y: number) {
        super();
        this.bitmap = bitmap;
        this.x = x;
        this.y = y;
    }

    get commandString(): string {
        const textDecoder = new TextDecoder('utf-8')
        const bytesString = textDecoder.decode(this.bitmap.bytes)

        return `${this.commandWithoutBytes}${bytesString.slice(0,5)}...\n`;
    }

    private get commandWithoutBytes(): string {
        return `BITMAP ${this.x}, ${this.y},${this.bitmap.width},${this.bitmap.height},0,`
    }

    async write(device: USBDevice): Promise<void> {
        await this.writeString(this.commandWithoutBytes, device)
        await this.writeBytes(this.bitmap.bytes, device)
        await this.terminateCommand(device)
    }
}