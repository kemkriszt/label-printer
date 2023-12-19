import { TSPLPrintCommand } from "@/commands"
import MockUSBDevice from "./mocks/MockUSBDevice"

import StringUtils from "@/helpers/StringUtils"

test("Test command write", () => {
    const utils = new StringUtils()
    const testString = "PRINT 1, 1"
    const testEndString = "\n"
    const testBytes = utils.toUTF8Array(testString)
    const testEndBytes =  utils.toUTF8Array(testEndString)

    const printCommand = new TSPLPrintCommand(1)
    let callIndex = 0
    MockUSBDevice.writeCallback = ((bytes: BufferSource) => {
        if (callIndex == 0) {
            expect(bytes).toEqual(testBytes)
            callIndex = 1
        } else if(callIndex == 1) {
            expect(bytes).toEqual(testEndBytes)
        }
    })

    printCommand.write(MockUSBDevice)
})