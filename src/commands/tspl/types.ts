export type Rotation = 0|90|180|270
export type Alignment = undefined|"left"|"center"|"right"

/**
 * Convert an alignemnt string to its number value
 * @param alignment 
 * @returns 
 */
export const alignmentToNumber = (alignment: Alignment): 0|1|2|3 => {
    switch(alignment) {
        case undefined: return 0
        case "left": return 1
        case "center": return 2
        case "right": return 3
    }
}

/**
 * Represents the strategy to use when two bitmaps overlap. The final value will be determined by
 * either overwriting the first bitmap's value with the second one or performing an 'or' or 'xor' operation
 * on the values
 */
export type GraphicMode = "overwrite"|"or"|"xor"
export type UnitSystem = "imperial"|"metric"|"dot"
export type ECCLevel = "L"|"M"|"Q"|"H"
export type AutoManual = "A"|"M"
export type QRModel = "M1"|"M2"
export type BarcodeType = "CODE128"|"EAN13"|"EAN8"|"EAN5"|"EAN2"|"UPC"|"CODE39"|"ITF14"|"MSI10"|"MSI11"|"MSI1010"|"MSI1110"|"pharmacode"|"codabar"
export type BarcodeHumanReable = "none"|"left"|"right"|"center"