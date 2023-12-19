type MockUSBDeviceType = {writeCallback: (arg: BufferSource) => void} & USBDevice

const MockUSBDevice: MockUSBDeviceType = {
    writeCallback: (arg: BufferSource) => {},
    usbVersionMajor: 0,
    usbVersionMinor: 0,
    usbVersionSubminor: 0,
    deviceClass: 0,
    deviceSubclass: 0,
    deviceProtocol: 0,
    vendorId: 0,
    productId: 0,
    deviceVersionMajor: 0,
    deviceVersionMinor: 0,
    deviceVersionSubminor: 0,
    configuration: {
        configurationValue: 0,
        configurationName: "0",
        interfaces: [
            { 
                alternate: {
                    alternateSetting: 0,
                    interfaceClass: 0,
                    interfaceProtocol: 0,
                    interfaceSubclass: 0,
                    interfaceName: "",
                    endpoints: [
                        { 
                            endpointNumber: 0, 
                            direction: "out", 
                            type:"bulk", 
                            packetSize: 0
                        }
                    ],

                },
                alternates: [],
                interfaceNumber: 0,
                claimed: true
            }
        ]
    },
    configurations: [
        {
            configurationValue: 0,
            configurationName: "0",
            interfaces: [
                { 
                    alternate: {
                        alternateSetting: 0,
                        interfaceClass: 0,
                        interfaceProtocol: 0,
                        interfaceSubclass: 0,
                        interfaceName: "",
                        endpoints: [
                            { 
                                endpointNumber: 0, 
                                direction: "out", 
                                type:"bulk", 
                                packetSize: 0
                            }
                        ],

                    },
                    alternates: [],
                    interfaceNumber: 0,
                    claimed: true
                }
            ]
        }
    ],
    opened: false,
    open: function (): Promise<void> {
        throw new Error("Function not implemented.")
    },
    close: function (): Promise<void> {
        throw new Error("Function not implemented.")
    },
    forget: function (): Promise<void> {
        throw new Error("Function not implemented.")
    },
    selectConfiguration: function (configurationValue: number): Promise<void> {
        throw new Error("Function not implemented.")
    },
    claimInterface: function (interfaceNumber: number): Promise<void> {
        throw new Error("Function not implemented.")
    },
    releaseInterface: function (interfaceNumber: number): Promise<void> {
        throw new Error("Function not implemented.")
    },
    selectAlternateInterface: function (interfaceNumber: number, alternateSetting: number): Promise<void> {
        throw new Error("Function not implemented.")
    },
    controlTransferIn: function (setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult> {
        throw new Error("Function not implemented.")
    },
    controlTransferOut: function (setup: USBControlTransferParameters, data?: BufferSource | undefined): Promise<USBOutTransferResult> {
        throw new Error("Function not implemented.")
    },
    clearHalt: function (direction: USBDirection, endpointNumber: number): Promise<void> {
        throw new Error("Function not implemented.")
    },
    transferIn: function (endpointNumber: number, length: number): Promise<USBInTransferResult> {
        throw new Error("Function not implemented.")
    },
    transferOut: function (_endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult> {
        this.writeCallback(data)
        return new Promise((resolve, _reject) => resolve({bytesWritten: 0, status: "ok"}))
    },
    isochronousTransferIn: function (endpointNumber: number, packetLengths: number[]): Promise<USBIsochronousInTransferResult> {
        throw new Error("Function not implemented.")
    },
    isochronousTransferOut: function (endpointNumber: number, data: BufferSource, packetLengths: number[]): Promise<USBIsochronousOutTransferResult> {
        throw new Error("Function not implemented.")
    },
    reset: function (): Promise<void> {
        throw new Error("Function not implemented.")
    }
}

export default MockUSBDevice