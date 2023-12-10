import TSPLCommand from "../TSPLCommand"

/**
 * A raw TSPL command. Can be used to use a command that is not yet supported
 */
export default class TSPLRawCommand extends TSPLCommand {
    /**
     * Raw command string
     */
    private readonly commandBody: string

    /**
     * Initialize a command with a raw body
     * @param body
     */
    constructor(body: string) {
        super()
        this.commandBody = body
    }

    get commandString(): string {
        return this.commandBody;
    }
}
