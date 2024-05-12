import { UnitSystem } from "@/commands"

const pointsPerInch = 72

export function getSizePreserveAspect(width: number, height: number, desiredWidth?: number, desiredHeight?: number) {
    // 0 width or height is not a valid number so we filter those dogether with undefined or null values
    if(desiredHeight && desiredWidth) {
        return { width: desiredWidth, height: desiredHeight }
    }
    if(desiredHeight) {
        const scaleFactor = desiredHeight / height
        return { width: width * scaleFactor, height: desiredHeight }
    } else if (desiredWidth) {
        const scaleFactor = desiredWidth / width
        return { width: desiredWidth, height: height * scaleFactor }
    } else {
        return { width, height }
    }
}

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

/**
 * Converts the points value to dots
 * 1 inch = 72 points (standard in typography)
 * Formula: dots = points * dpi / pointsPerInch
 * @param points 
 * @param dpi 
 * @returns 
 */
export function pointsToDots(points: number, dpi: number): number {
    const pointsPerInch = 72;
    const dots = points * dpi / pointsPerInch;
    return dots;
}