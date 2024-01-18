import { Point, UnitSystem } from "./index"
import Command from "./Command";
import CommandGroup from "./CommandGroup";
import { Alignment, BarcodeHumanReable, BarcodeType, GraphicMode, LabelDirection, Rotation } from "./tspl";
import { BitmapLike } from "@/helpers/ImageUtils";

/**
 * Interface that should be implemented by a command generator object for each language
 */
export default interface CommandGenerator<T extends Command> {
    commandGroup: (commands: T[]) => CommandGroup<T>
    print: (sets: number, copiesPerSet: number) => T
    text: (content: string, x: number, y: number, font: string|"default", size: number) => T
    upload: (name: string, data: ArrayBuffer|Uint8Array) => T
    line: (start: Point, end: Point, thickness: number) => T
    image: (image: BitmapLike, x: number, y: number, mode?: GraphicMode) => T
    qrCode: (content: string, width: number, x: number, y: number) => T,
    barCode: (content: string, x: number, y: number, type: BarcodeType, height: number, rotation: Rotation, humanReadable: BarcodeHumanReable, alignment: Alignment) => T
    /**
     * Should instruct the printer to display the image of the label on its screen instead of printing it
     */
    display: () => T
    /**
     * This should generate the needed commands to set up a label before printing
     */
    setUp: (width: number, height: number, gap: number, offset: number, direction: LabelDirection, mirror: boolean, unitSystem: UnitSystem) => T
}