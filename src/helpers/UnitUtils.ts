import { UnitSystem } from "@/commands"

export function valueWithUnit(value: number, unitSystem: UnitSystem) {
    switch(unitSystem) {
        case "dot": return `${value} dot`
        case "imperial": return value
        case "metric": return `${value} mm`
    }
}