import TSPLCommand from "../../TSPLCommand";

/**
 * Clear the image buffer
 * {@link /documentsions/TSPL.pdf}
 */
export default class TSPLCLSCommand extends TSPLCommand {
    get commandString(): string {
        return "CLS"
    }
}