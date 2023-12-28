import { usbAgent } from "@/helpers/USBUtils"
import { PrinterService } from "@/printers/PrinterService"

export default async () => {
    const devices = await usbAgent.getDevices()

    console.log(devices)
    const device = devices[0]
    device.open()
    device.selectConfiguration(1)
    device.claimInterface(0)
    // @ts-ignore
    console.log(device.configuration?.interfaces[0].alternate.endpoints[0].transfer)
    device.close()
    // const printers = await PrinterService.getPrinters()
    // console.log(printers)
}