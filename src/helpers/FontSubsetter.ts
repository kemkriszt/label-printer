type WasmExports = {
    memory: WebAssembly.Memory
    malloc: (size: number) => number
    free: (ptr: number) => void
    hb_blob_create: (data: number, length: number, mode: number, userData: number, destroy: number) => number
    hb_blob_destroy: (blob: number) => void
    hb_blob_get_data: (blob: number, length: number) => number
    hb_blob_get_length: (blob: number) => number
    hb_face_create: (blob: number, index: number) => number
    hb_face_destroy: (face: number) => void
    hb_face_reference_blob: (face: number) => number
    hb_subset_input_create_or_fail: () => number
    hb_subset_input_destroy: (input: number) => void
    hb_subset_input_unicode_set: (input: number) => number
    hb_subset_or_fail: (face: number, input: number) => number
    hb_set_add: (set: number, codepoint: number) => void
}

let cachedInstance: WasmExports | null = null
let userWasmBinary: ArrayBuffer | null = null

/**
 * Provide the hb-subset.wasm binary for use in browser environments.
 * In Node.js this is loaded automatically from the harfbuzzjs package.
 * Call this once during app init before printing custom fonts.
 *
 * @example
 * const res = await fetch('/hb-subset.wasm')
 * Label.setSubsetWasm(await res.arrayBuffer())
 */
export function setSubsetWasm(binary: ArrayBuffer) {
    userWasmBinary = binary
    cachedInstance = null
}

async function loadWasmBinary(): Promise<ArrayBuffer | null> {
    if (userWasmBinary) return userWasmBinary

    if (typeof window !== "undefined") return null

    try {
        const fs = eval("require")("fs")
        const path = eval("require")("path")
        const harfbuzzEntry: string = eval("require").resolve("harfbuzzjs")
        const wasmPath: string = path.join(path.dirname(harfbuzzEntry), "hb-subset.wasm")
        const buf: Buffer = fs.readFileSync(wasmPath)
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
    } catch {
        return null
    }
}

async function getInstance(): Promise<WasmExports | null> {
    if (cachedInstance) return cachedInstance

    const binary = await loadWasmBinary()
    if (!binary) return null

    try {
        const { instance } = await WebAssembly.instantiate(binary)
        cachedInstance = instance.exports as unknown as WasmExports
        return cachedInstance
    } catch {
        return null
    }
}

export async function subsetFontData(fontData: ArrayBuffer, text: string): Promise<ArrayBuffer> {
    if (text.length === 0) return fontData

    const exp = await getInstance()
    if (!exp) return fontData

    const fontBytes = new Uint8Array(fontData)
    const fontPtr = exp.malloc(fontBytes.byteLength)
    new Uint8Array(exp.memory.buffer).set(fontBytes, fontPtr)

    const blob = exp.hb_blob_create(fontPtr, fontBytes.byteLength, 2, 0, 0)
    const face = exp.hb_face_create(blob, 0)
    exp.hb_blob_destroy(blob)

    const input = exp.hb_subset_input_create_or_fail()
    const unicodeSet = exp.hb_subset_input_unicode_set(input)
    for (const char of text) {
        exp.hb_set_add(unicodeSet, char.codePointAt(0)!)
    }

    const subsetFace = exp.hb_subset_or_fail(face, input)
    exp.hb_subset_input_destroy(input)

    const resultBlob = exp.hb_face_reference_blob(subsetFace)
    const dataPtr = exp.hb_blob_get_data(resultBlob, 0)
    const dataLen = exp.hb_blob_get_length(resultBlob)

    // Copy result out before cleanup — memory may be freed after destroy calls
    const result = dataLen > 0
        ? new Uint8Array(exp.memory.buffer).slice(dataPtr, dataPtr + dataLen).buffer
        : fontData

    exp.hb_blob_destroy(resultBlob)
    exp.hb_face_destroy(subsetFace)
    exp.hb_face_destroy(face)
    exp.free(fontPtr)

    return result
}
