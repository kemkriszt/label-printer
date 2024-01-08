import { UnitSystem } from "@/commands"

const pointsPerInch = 72

export function valueWithUnit(value: number, unitSystem: UnitSystem) {
    switch(unitSystem) {
        case "dot": return `${value} dot`
        case "imperial": return value
        case "metric": return `${value} mm`
    }
}

/**
 * Convert a value from dots in points in a given dpi
 */
export function dotToPoint(dots: number, dpi: number): number {
    const inch = dots / dpi
    return Math.round(inch * pointsPerInch)
}