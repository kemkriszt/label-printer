export type Rotation = 0|90|180|270
export type Alignment = undefined|"left"|"center"|"right"
/**
 * Represents the strategy to use when two bitmaps overlap. The final value will be determined by
 * either overwriting the first bitmap's value with the second one or performing an 'or' or 'xor' operation
 * on the values
 */
export type GraphicMode = "overwrite"|"or"|"xor"
export type UnitSystem = "imperial"|"metric"|"dot"