import { Point, Rotation } from "@/commands"

export interface RotatableField {
    setRotation(rotation: Rotation): void
    getRotation(): Rotation
}

export interface PositionedField {
    getPosition(): Point
    setPosition(position: Point): void
}