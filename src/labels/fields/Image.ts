import { Command, Point, PrinterLanguage } from "@/commands";
import { PrintConfig } from "../Printable";
import ImageUtils, { BitmapLike } from "@/helpers/ImageUtils";
import RotatableLabelField from "./superClasses/RotatableLabelField";
import { PositionedField } from "./superClasses/interfaces";

export default class Image extends RotatableLabelField implements PositionedField {
    /**
     * X coordinate in dots
     */
    private x: number
    /**
     * Y coordinate in dots
     */
    private y: number

    private readonly image: BitmapLike

    constructor(x: number, y: number, image: BitmapLike) {
        super()
        this.x = x
        this.y = y
        this.image = image
    }

    setPosition(position: Point): void {
        this.x = position.x
        this.y = position.y
    }

    getPosition(): Point {
        return { x: this.x, y: this.y }
    }

    async commandForLanguage(language: PrinterLanguage, _config?: PrintConfig | undefined): Promise<Command> {
        if (this.rotation === 0) {
            return await this.commandGeneratorFor(language).image(this.image, this.x, this.y)
        }

        const srcW = this.image.width * 8  // original width in dots
        const srcH = this.image.height     // original height in dots
        const bitmap = ImageUtils.rotateBWBitmap(this.image, 360 - this.rotation as 90 | 180 | 270)

        let dx = this.x
        let dy = this.y
        switch (this.rotation) {
            case 90:  dx = this.x - srcH; break
            case 180: dx = this.x - srcW; dy = this.y - srcH; break
            case 270: dy = this.y - srcW; break
        }

        return await this.commandGeneratorFor(language).image(bitmap, dx, dy)
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