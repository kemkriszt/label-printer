import { InEndpoint, WebUSB } from "usb";
import StringUtils from "./StringUtils";

const unsupportedUsbError = "usb-unsupported"
const stringHelper = new StringUtils()

/**
 * @returns The appropiate USB agent based on the environment
 */
const getUSB = (): USB => {
    if(typeof navigator !== "undefined") {
        if(navigator.usb) {
            return navigator.usb
        } else {
            throw unsupportedUsbError
        }
    }

    return new WebUSB({allowAllDevices: true})
}

export const usbAgent = getUSB()

/**
 * @returns A list of available devices
 */
export const getDevices = async (): Promise<UsbDevice[]> => {
    const devices = await usbAgent.getDevices()
    return devices.map(device => new UsbDevice(device) )
}

/**
 * Convenience wrapper for a web usb device
 */
export class UsbDevice {
    private readonly device: USBDevice

    get opened() {
        return this.device.opened
    }

    /**
     * All available endpoints
     */
    private get endpoints() {
        return this.device.configuration?.interfaces[0].alternate.endpoints ?? []
    }

    /**
     * Endpoint for writing
     */
    private get outEndpoint() {
        return this.endpoints.find(e => e.direction == "out")?.endpointNumber
    }

    /**
     * Endpoint for reading
     */
    private get inEndpoint() {
        return this.endpoints.find(e => e.direction == "in")?.endpointNumber
    }

    constructor(device: USBDevice) {
        this.device = device
    }

    /**
     * Open the device and claim its interface
     */
    async openAndConfigure() {
        await this.device.open();
        await this.device.selectConfiguration(1);
        await this.device.claimInterface(0);
    }

    /**
     * Closes the device
     */
    async close() {
        await this.device.close()
    }

    /**
     * Write data to an USB device
     * @param data Data to write
     */
    async writeData(data: Uint8Array): Promise<void> {
        const endpointNumber = this.outEndpoint
        console.log(endpointNumber)
        await this.device.transferOut(endpointNumber!, data)
    }

    /**
     * Writes a text to a device
     * @param text Text to write
     */
    async writeString(text: string): Promise<void> {
        const bytes = stringHelper.toUTF8Array(text)
        await this.writeData(bytes)
    }

    /**
     * Reads bytes from the usb device
     * @param length The max length of the incoming data. 
     * @returns Bytes received as a DataView or undefined. If data is longer then `length`, undefined will be returned
     */
    async readData(length: number): Promise<DataView|undefined> {
        const endpointNumber = this.inEndpoint
        const result = await this.device.transferIn(endpointNumber!, length)

        if(result.status == "ok" && result.data) {
            return result.data
        } else {
            return undefined
        }
    }

    /**
     * Reads data from the usb device and converts it to string
     * {@see readData}
     */
    async readString(length: number): Promise<string|undefined> {
        const bytes = await this.readData(length)
        if(bytes) return stringHelper.toString(bytes)
        return undefined
    }
}
