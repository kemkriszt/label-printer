# Label Printer

> :warning: `label-printer` is still under heavy development and is subject to frequent API changes

This package provides a js based implementation for variouse languages used for label printers

## Layers

The packages is logacally divided into multiple sub layers. These are not separate modules per say, but separated parts of the code that serve different purposes

### 1. Command Layer

This layer provides a low lever wrapper for the different languages commands. Using this module, you can create commands that suite your needs the best or you can integrate this pacakge in your codebase

#### TODO

- Finish implementing basic commands
- Add example code

### 2. Label layer

This layer provides a language independent API to construct a label (object representation) without any knowledge of the fine details of the printer the label will be printed on.

#### TODO

- Add example code
- Implement layer

### 3. Printer layer

This layer contains code to interact with printers

#### TODO

- Add example code
- Implement layer

## Documentation of supported languages

- [TSPL](documentations/TSPL.pdf)

# Usefull units:

- 1 pt = 1/72 inch
- 1 dot = 1 / dpi

# Notes

- If a font is not working, make sure the extension is TTF
- If you want to use bold fonts, make sure you have one for weight 700
- Regular font weight is 400

# Update package

- Run `pnpm changeset` to create change
- Run `pnpm changeset version` to create an update with all the versions
- Create PR and merge into main