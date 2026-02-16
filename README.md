# Open Folder in Cursor

A Raycast extension that lets you quickly search for a folder in `~/Sites` and open it in [Cursor](https://cursor.sh).

## Usage

1. Open Raycast and type `c` (or "Open Folder in Cursor")
2. Press Enter to launch the command
3. Start typing a folder name — results filter live as you type
4. Press Enter on a folder to open it in Cursor

## Actions

| Action              | Shortcut         |
| ------------------- | ---------------- |
| Open in Cursor      | `Enter`          |
| Show in Finder      | `Cmd + Enter`    |
| Copy Path           | `Cmd + Shift + C`|

## Configuration

The extension searches folders inside `~/Sites`. To change this, update the `BASE_FOLDER` constant in `src/index.tsx`.

## Prerequisites

- [Raycast](https://raycast.com)
- [Cursor](https://cursor.sh) with the `cursor` CLI command available in your PATH

## Development

```bash
# Install dependencies
npm install

# Start development mode (loads the extension in Raycast)
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```
