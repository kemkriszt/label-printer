import StringUtils from "@/helpers/StringUtils";

let utils = new StringUtils()

test("String to bytes conversion", () => {
    const testString = "PRINT"
    const testStringResult = new Uint8Array([ 80, 82, 73, 78, 84 ]);

    const result = utils.toUTF8Array(testString)

    expect(result).toEqual(testStringResult)
})