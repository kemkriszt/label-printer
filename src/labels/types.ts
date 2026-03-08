import { Font as FKFont } from "fontkit"
import { Rotation } from "@/commands";

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type FontStyle = "italic"|"normal"

export type Font = {
    name: string,
    data: ArrayBufferLike
    font: FKFont,
    weight: number,
    style: FontStyle,
}

export type NamelessFont = Omit<Font, "name">

export type FontOption = Expand<Partial<Pick<Font, "style"|"weight">> & Pick<Font, "name"> & {size: number}> // Size in dots

export type FontFamily = {
    name: string,
    fonts: NamelessFont[]
}

export type IndexedFont = NamelessFont & {alias: string}

export type IndexedFontFamily = {
    fonts: {
        [key: string]: IndexedFont
    }
}

/**
 * The orientation, the label will be printed on. This allows designing a label in the natural orientation, than printing to 
 * a label that is rotated in the printer. The rotation is applied to all fields on the label, and it is independent from the rotation of individual fields.
 */
export type LabelOrientation = "normal"|"left"|"right"|"upside-down"
export const rotationForOrientation: (orienattion: LabelOrientation) => Rotation = (orientation) => {
    switch(orientation) {
        case "normal": return 0
        case "left": return 90
        case "upside-down": return 180
        case "right": return 270
    }
}