import { valueWithUnit } from "@/helpers/UnitUtils";
import TSPLCommand from "../../TSPLCommand";
import { UnitSystem } from "@/commands";

/**
 * Defines the gap between two labels
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLGapCommand extends TSPLCommand {
    private readonly gap: number
    private readonly offset: number

    /**
     * This controls what unit the {@link width} and {@link height} will be
     * - For imperial, the unit is inches
     * - For metric, the unit is milimeters
     * - For dots, the unit is dots
     */
    private readonly unitSystem: UnitSystem

    constructor(gap: number, offset: number, unitSystem: UnitSystem) {
        super()
        this.gap  = gap
        this.offset = offset
        this.unitSystem = unitSystem
    } 

    get commandString(): string {
        return `GAP ${valueWithUnit(this.gap, this.unitSystem)}, ${valueWithUnit(this.offset, this.unitSystem)}`
    }
}