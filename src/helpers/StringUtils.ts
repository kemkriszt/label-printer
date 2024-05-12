/**
 * Collection of helpers to work with strings
 */
export default class StringUtils {
    /**
     * Convert string to utf8 array
     * @param str Convert string to byte array
     */
    toUTF8Array(str: string) {
        let utf8Encode = new TextEncoder();
        return utf8Encode.encode(str)
    }

    /**
     * Convert bytes to utf8 encoded string
     * @param bytes Bytes to decode
     * @returns A string
     */
    toString(bytes: Uint8Array|DataView) {
        let decoder = new TextDecoder()
        return decoder.decode(bytes)
    }
}

export const isWhitespace = (text: string) => text.trim() === ""