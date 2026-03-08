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
export type LabelDirection = "normal"|"inverse"
export type ECCLevel = "L"|"M"|"Q"|"H"
export type AutoManual = "A"|"M"
export type QRModel = "M1"|"M2"
export type BarcodeType = "128"|"EAN128"|"25"|"25C"|"39"|"39C"|"93"|"EAN13"|"EAN13+2"|"EAN13+5"|"EAN8"|"EAN8+2"|"EAN8+5"|"CODA"|"POST"|"UPCA"|"UPCA+2"|"UPCA+5"|"UPCE"|"UPCE+2"|"UPCE+5"|"CPOST"|"MSI"|"MSIC"|"PLESSEY"|"ITF14"|"EAN14"|"11"|"TELEPEN"|"TELEPENN"|"PLANET"|"CODE49"|"DPI"|"DPL"
export type BarcodeHumanReable = "none"|"left"|"right"|"center"