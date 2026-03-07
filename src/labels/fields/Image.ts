import { Command, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import LabelField from "./LabelField";
import ImageUtils, { BitmapLike } from "@/helpers/ImageUtils";
import { Rotation } from "@/commands/tspl";

export default class Image extends LabelField {
    /**
     * X coordinate in dots
     */
    private readonly x: number
    /**
     * Y coordinate in dots
     */
    private readonly y: number

    private readonly image: BitmapLike
    private rotation: Rotation = 0

    constructor(x: number, y: number, image: BitmapLike) {
        super()
        this.x = x
        this.y = y
        this.image = image
    }

    setRotation(rotation: Rotation) {
        this.rotation = rotation
    }

    async commandForLanguage(language: PrinterLanguage, _config?: PrintConfig | undefined): Promise<Command> {

        const bitmap = this.rotation !== 0
            ? ImageUtils.rotateBWBitmap(this.image, 360 - this.rotation as 90 | 180 | 270)
            : this.image
        return await this.commandGeneratorFor(language).image(bitmap, this.x, this.y)
    }

    /**
     * Create an image field for an image
     * @param image 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @returns 
     */
    static async create(image: string|Blob, x: number, y: number, width?: number, height?: number): Promise<Image> {
        const bitmap = await ImageUtils.getBWBitmap(image, width, height)

        return new Image(x, y, bitmap)
    }
}