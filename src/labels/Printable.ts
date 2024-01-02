import { Command, PrinterLanguage, tspl } from "@/commands";
import CommandGenerator from "@/commands/CommandGenerator";
import { Printer } from "@/printers";

/**
 * A component that can be directly printed to label printer
 */
export default abstract class Printable {
    /**
     * Generates a printable command
     * @param language The printing language that should be used
     * @returns A promise of a command that can be printed
     */
    abstract commandForLanguage(language: PrinterLanguage): Promise<Command>

    /**
     * Generates printable command for the given printer. Can be used to obtain a command for fields supported by the package then customizing it before printing
     * @param printer Printer to generate the command. Important because the command is printer language specific
     * @returns A promise for a command. Most commands are syncronouse but some may require to access async resources
     */
    async commandForPrinter(printer: Printer): Promise<Command> {
        return await this.commandForLanguage(printer.language)
    }

    /**
     * Obtain a command generator for the given language
     * @param language Language to get generator for
     */
    protected commandGeneratorFor(language: PrinterLanguage): CommandGenerator<any> {
        switch(language) {
            case "tspl": return tspl.commandGenerator
        }
    }
}