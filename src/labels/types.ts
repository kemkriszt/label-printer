import { Font as FKFont } from "fontkit"

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