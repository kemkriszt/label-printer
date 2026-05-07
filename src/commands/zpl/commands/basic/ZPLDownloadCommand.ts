import ZPLCommand from "../../ZPLCommand";

export default class ZPLDownloadCommand extends ZPLCommand {
    private readonly name: string
    private readonly data: ArrayBuffer | Uint8Array

    constructor(name: string, data: ArrayBuffer | Uint8Array) {
        super()
        this.name = name
        this.data = data
    }

    get commandString(): string {
        const bytes = this.data instanceof Uint8Array ? this.data : new Uint8Array(this.data)
        const hex = ZPLDownloadCommand.toHex(bytes)
        return `~DYR:${this.name},B,T,${bytes.length},${hex}`
    }

    private static toHex(bytes: Uint8Array): string {
        let hex = ""
        for (let i = 0; i < bytes.length; i++) {
            hex += bytes[i].toString(16).padStart(2, "0").toUpperCase()
        }
        return hex
    }
}
