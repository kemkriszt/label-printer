import { getSizePreserveAspect } from "./UnitUtils"
import ImageProcessor from "./ImageProcessor"

/**
 * Helper type to transmit image bitmap data
 */
export type Pixels = {
    data: Uint8Array, 
    width: number,
    height: number, 
    bitsPerPixel: number
}

export type BitmapLike = {
    width: number,
    height: number,
    bytes: Uint8Array
}

/**
 * Helper type to transmit black and white bitmap data
 */
export type BWBitmap = BitmapLike

const BLACK_PIXEL = 0
const WHITE_PIXEL = 1

/**
 * Set of image utility
 */
export default class ImageUtils {
    /**
     * Get pixel information about an image
     * @param image Image to process
     * @returns 
     */
    static async getPixels(image: string|Blob): Promise<Pixels> {
        return await ImageProcessor.getImageData(image)
    }

    /**
     * Return a bitmap in which all pixels are represented with one bit of either 1 or 0 representing white and black
     * pixels respectively. `destinationWidth` and `destinationHeight` have to be smaller or equal to the
     * input size as only downscaling is performed
     * 
     * @param image Image to process  
     * @param destinationWidth Width of the ouput bitmap
     * @param destinationHeight Height of the output bitmap
     * @returns 
     */
    static async getBWBitmap(image: string, destinationWidth?: number, destinationHeight?: number): Promise<BWBitmap> {
        const {
            data,
            width,
            height,
            bitsPerPixel
        } = await this.getPixels(image)
    
        const dim = getSizePreserveAspect(width, height, destinationWidth, destinationHeight)
        // Number of pixels width and height => number of bits for each row and number of rows
        const dWidth = dim.width
        const dHeight = dim.height
    
        const differenceToDividable = dWidth % 8 == 0 ? 0 : (8 - (dWidth % 8))
        const dividableDWidth = dWidth + differenceToDividable
    
        // Size of the array has to be with * height but width has to be extended to be dividable by 8
        const bitmapData = new Uint8Array(dividableDWidth  * dHeight)
    
        let destinationIndex = 0
        for (let h=0; h < dHeight; h++) {
            const originalHeight = Math.round((h * (height - 1)) / (dHeight - 1))
    
            for(let w=0; w < dWidth; w++) {
                const originalWidth = Math.round((w * (width - 1)) / (dWidth - 1))
    
                const baseIndex = (originalHeight * width * bitsPerPixel) + (originalWidth * bitsPerPixel)
    
                const r = data[baseIndex]
                const g = data[baseIndex + 1]
                const b = data[baseIndex + 2]
                const a = data[baseIndex + 3]
    
                if(a > 128) {
                    const avg = (r + g + b) / 3
    
                    if(avg > 128) {
                        bitmapData[destinationIndex] = WHITE_PIXEL
                    } else {
                        bitmapData[destinationIndex] = BLACK_PIXEL
                    }
                } else {
                    bitmapData[destinationIndex] = WHITE_PIXEL
                }
                destinationIndex += 1
            }
    
            for(let i=0; i < differenceToDividable; i++) {
                bitmapData[destinationIndex] = WHITE_PIXEL
                destinationIndex += 1
            }
        }
    
        const byteArrays = this.chunk(bitmapData,8)
        const widthInBytes = dividableDWidth / 8
    
        const bytes = byteArrays.map(this.bitsToByte)
        const finalBytes = new Uint8Array(bytes)
    
        return {
            width: widthInBytes,
            height: dHeight,
            bytes: finalBytes
        }
    }

    /**
     * Splits an array into chunks.
     * @param originalArray
     * @param chunkSize
     * @returns
     */
    private static chunk(originalArray: Uint8Array, chunkSize: number): Uint8Array[] {
        const resultArray = [];

        for (let i = 0; i < originalArray.length; i += chunkSize) {
            const chunk = originalArray.slice(i, i + chunkSize);
            resultArray.push(chunk);
        }

        return resultArray;
    }

    /**
     * Converts an array of bits to a byte
     * @param bits
     * @returns
     */
    private static bitsToByte(bits: Uint8Array) {
        let byteValue = 0;
        for (let i = 0; i < bits.length; i++) {
            byteValue = (byteValue << 1) | bits[i];
        }
        return byteValue;
    }
}