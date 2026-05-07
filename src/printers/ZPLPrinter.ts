import { PrinterLanguage } from "@/commands"
import Printer, { PrinterStatus } from "./Printer"
import Device from "@/helpers/Device"
import NetworkDevice from "@/helpers/NetworkDevice"
import { discoverBonjourServices } from "@/helpers/BonjourUtils"

export default class ZPLPrinter extends Printer {
    get language(): PrinterLanguage {
        return "zpl"
    }

    async feedLabel(): Promise<void> {
        if (!this.device.opened) await this.device.openAndConfigure()
        await this.device.writeString("^PF\r\n")
    }

    async getModelname(): Promise<string> {
        if (!this.device.opened) await this.device.openAndConfigure()
        await this.device.writeString("~HI\r\n")

        const response = await this.device.readString(256)
        if (!response) return ""
        // ~HI response: "XXXXX","V1.0","...",...  — first quoted field is the model
        const match = response.match(/"([^"]+)"/)
        return match ? match[1].trim() : response.trim()
    }

    async getStatus(): Promise<PrinterStatus> {
        if (!this.device.opened) await this.device.openAndConfigure()
        await this.device.writeString("~HS\r\n")

        const response = await this.device.readString(256)
        if (!response) return "other_error"
        return ZPLPrinter.parseStatus(response)
    }

    private static parseStatus(response: string): PrinterStatus {
        // ~HS returns 3 lines of status bytes. Bit 3 of byte 1 = paper out.
        // We do a best-effort parse of the first line.
        const lines = response.split(/\r?\n/).filter(l => l.trim().length > 0)
        if (lines.length === 0) return "other_error"

        const firstLine = lines[0]
        const byte1 = parseInt(firstLine.substring(0, 2), 16)

        if (isNaN(byte1)) return "other_error"

        // Bit 3 (0x08) of first byte = paper out
        if (byte1 & 0x08) return "out_of_paper"
        // Bit 2 (0x04) = ribbon out
        if (byte1 & 0x04) return "out_of_ribbon"
        // Bit 1 (0x02) = head open
        if (byte1 & 0x02) return "head_opened"
        // Bit 6 (0x40) = paper jam
        if (byte1 & 0x40) return "paper_jam"

        return "normal"
    }

    static async try(device: Device): Promise<boolean> {
        if (!device.opened) await device.openAndConfigure()

        await device.writeString("~HI\r\n")
        const response = await device.readString(64)
        await device.close()

        if (!response) return false
        // ZPL printers respond to ~HI with quoted comma-separated model info
        // e.g. "ZT410","V86.20.18Z","...",...  or similar
        // Verify by checking for multiple quoted fields separated by commas
        return /^"[^"]*"/.test(response.trim())
    }

    static async discoverDevices(): Promise<NetworkDevice[]> {
        if (typeof window !== "undefined") return []

        const services = await discoverBonjourServices([
            "pdl-datastream",
            "printer",
            "ipp",
            "ipps",
        ])

        let uniqueHosts = Array.from(new Set(services.map(s => s.host).filter(Boolean)))

        if (uniqueHosts.length === 0) {
            uniqueHosts = await ZPLPrinter.discoverHostsBySubnetScan()
        }

        const candidates = uniqueHosts.map(host => ({ host, port: 9100 }))
        const concurrency = 5
        const verified: NetworkDevice[] = []

        for (let i = 0; i < candidates.length; i += concurrency) {
            const batch = candidates.slice(i, i + concurrency)
            const results = await Promise.all(batch.map(async (c) => {
                const device = new NetworkDevice(c.host, c.port, 4000, 1000)
                try {
                    const ok = await ZPLPrinter.try(device)
                    return ok ? device : undefined
                } catch (_e) {
                    try { await device.close() } catch (_e2) {}
                    return undefined
                }
            }))
            verified.push(...(results.filter(Boolean) as NetworkDevice[]))
        }

        return verified
    }

    private static async discoverHostsBySubnetScan(): Promise<string[]> {
        if (typeof window !== "undefined") return []

        const req = ZPLPrinter.getNodeRequire()
        if (!req) return []

        const os: any = req("os")
        const networkInterfaces: any = os.networkInterfaces?.() ?? {}

        const privatePrefixes = new Set<string>()

        const isPrivateIpv4 = (ip: string): boolean => {
            if (ip.startsWith("10.")) return true
            if (ip.startsWith("192.168.")) return true
            const m = ip.match(/^172\.(\d+)\./)
            if (m) {
                const n = Number(m[1])
                return n >= 16 && n <= 31
            }
            return false
        }

        for (const key of Object.keys(networkInterfaces)) {
            const infos = networkInterfaces[key] ?? []
            for (const info of infos) {
                if (info?.internal) continue
                if (info?.family !== "IPv4") continue
                if (typeof info?.address !== "string") continue
                if (!isPrivateIpv4(info.address)) continue
                const parts = info.address.split(".")
                if (parts.length !== 4) continue
                privatePrefixes.add(`${parts[0]}.${parts[1]}.${parts[2]}`)
            }
        }

        const prefixes = Array.from(privatePrefixes).slice(0, 2)
        if (prefixes.length === 0) return []

        const hosts: string[] = []
        for (const prefix of prefixes) {
            for (let i = 1; i <= 254; i++) {
                hosts.push(`${prefix}.${i}`)
            }
        }

        const concurrency = 30
        const verifiedHosts: string[] = []
        const startedAt = Date.now()
        const maxDurationMs = 15000

        for (let i = 0; i < hosts.length; i += concurrency) {
            if (Date.now() - startedAt > maxDurationMs) break
            if (verifiedHosts.length > 0) break
            const batch = hosts.slice(i, i + concurrency)
            const results = await Promise.all(batch.map(async (host) => {
                const device = new NetworkDevice(host, 9100, 800, 800)
                try {
                    const ok = await ZPLPrinter.try(device)
                    return ok ? host : undefined
                } catch (_e) {
                    try { await device.close() } catch (_e2) {}
                    return undefined
                }
            }))
            verifiedHosts.push(...(results.filter(Boolean) as string[]))
        }

        return verifiedHosts
    }

    private static getNodeRequire(): ((module: string) => any) | undefined {
        if (typeof window !== "undefined") return undefined
        const override = (globalThis as any).__label_printer_require
        if (typeof override === "function") return override
        // TODO: Check how to avoid eval
        return eval("require")
    }
}
