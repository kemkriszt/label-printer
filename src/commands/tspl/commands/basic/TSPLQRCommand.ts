import { ECCLevel, AutoManual, Rotation, QRModel } from "../../types";
import TSPLVisualCommand from "../TSPLVisualCommand";

/**
 * Prints a QR code
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLQRCommand extends TSPLVisualCommand {
    private readonly ecc: ECCLevel
    private readonly cellWidth: number
    private readonly mode: AutoManual
    private readonly rotation: Rotation
    private readonly model: QRModel
    /**
     * Should be between 0 and 7
     */
    private readonly mask: number
    private readonly content: string

    constructor(content: string, 
                x: number, 
                y: number, 
                cellWidth: number, 
                ecc: ECCLevel = "H", 
                mode: AutoManual = "A", 
                rotation: Rotation = 0, 
                model: QRModel = "M2", 
                mask: number = 7) {
        super(x,y)
        this.content = content
        this.cellWidth = cellWidth
        this.ecc = ecc
        this.mode = mode
        this.rotation = rotation
        this.model = model
        this.mask = mask

        if (mask < 0 || mask > 8) {
            throw new Error(`Invalid mask provided: ${mask}`)
        }
    }

    get commandString(): string {
        return `QRCODE ${this.x}, ${this.y}, ${this.ecc}, ${this.cellWidth}, ${this.mode}, ${this.rotation}, ${this.model}, ${this.mask}, \"${this.content}\"`
    }
}