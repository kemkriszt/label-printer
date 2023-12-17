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
}