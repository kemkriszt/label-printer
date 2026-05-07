import { UnitSystem } from "@/commands";
import { LabelDirection } from "@/commands/tspl";
import { mmToDot, inToDot } from "@/helpers/UnitUtils";
import ZPLCommand from "../../ZPLCommand";

export default class ZPLSetupCommand extends ZPLCommand {
    private readonly widthDots: number
    private readonly heightDots: number
    private readonly offsetDots: number
    private readonly direction: LabelDirection
    private readonly mirror: boolean
    private readonly darkness: number

    constructor(
        width: number,
        height: number,
        offset: number,
        direction: LabelDirection,
        mirror: boolean,
        unitSystem: UnitSystem,
        density: number,
        dpi: number
    ) {
        super()
        this.widthDots = ZPLSetupCommand.toDots(width, dpi, unitSystem)
        this.heightDots = ZPLSetupCommand.toDots(height, dpi, unitSystem)
        this.offsetDots = ZPLSetupCommand.toDots(offset, dpi, unitSystem)
        this.direction = direction
        this.mirror = mirror
        // Map TSPL density (0–15) → ZPL ^MD (-30 to 30)
        this.darkness = Math.round((density / 15) * 30 - 15)
    }

    get commandString(): string {
        const orientation = (this.direction === "normal" && !this.mirror) ? "N" : "I"
        const parts = [
            `^XA`,
            `^PW${Math.round(this.widthDots)}`,
            `^LL${Math.round(this.heightDots)}`,
            `^MD${this.darkness}`,
            `^PO${orientation}`,
        ]
        if (this.offsetDots > 0) {
            parts.push(`^LT${Math.round(this.offsetDots)}`)
        }
        return parts.join("")
    }

    private static toDots(value: number, dpi: number, unitSystem: UnitSystem): number {
        switch (unitSystem) {
            case "dot": return value
            case "imperial": return inToDot(value, dpi)
            case "metric": return mmToDot(value, dpi)
        }
    }
}
