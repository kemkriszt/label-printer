import { Font as FKFont } from "fontkit"

export type Font = {
    name: string,
    data: ArrayBufferLike
    font: FKFont
}