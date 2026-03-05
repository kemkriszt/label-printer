import { Label } from "@/labels"
import { BarCode } from "@/labels/fields"

/**
 * Demonstrates different barcode symbologies and bar widths.
 *
 *  1. CODE128  – 1:1 ratio (narrow === wide), barWidth 2
 *  2. EAN-13   – 1:1 ratio (narrow === wide), barWidth 3
 */
export default async (): Promise<Label> => {
    const label = new Label(50, 25)
    const ean1 = new BarCode("5901234123457", 10, 10, "128", 10, 1.5)
    const ean2 = new BarCode("5901234123457", 10, 50, "128", 10, 2)
    const ean3 = new BarCode("5901234123457", 10, 80, "128", 10, 2.5)
    ean1.setHumanReadable("center")
    ean2.setHumanReadable("center")
    ean3.setHumanReadable("center")

    label.add(ean1)
    label.add(ean2)
    label.add(ean3)


    return label
}
