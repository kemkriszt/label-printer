import TSPLCommand from "../../TSPLCommand";
import { UnitSystem } from "../../types";

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
        return `GAP ${this.valueWithUnit(this.gap)}, ${this.valueWithUnit(this.offset)}`
    }

    private valueWithUnit(value: number) {
        switch(this.unitSystem) {
            case "dot": return `${value} dot`
            case "imperial": return value
            case "metric": return `${value} mm`
        }
    }
}