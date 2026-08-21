# Open Folder in Zed

A Raycast extension that lets you quickly search for a folder in `~/Projects` and open it in [Zed](https://zed.dev).

## Usage

1. Open Raycast and type `z` (or "Open Folder in Zed")
2. Press Enter to launch the command
3. Start typing a folder name — results filter live as you type
4. Press Enter on a folder to open it in Zed

## Actions

| Action              | Shortcut         |
| ------------------- | ---------------- |
| Open in Zed         | `Enter`          |
| Show in Finder      | `Cmd + Enter`    |
| Copy Path           | `Cmd + Shift + C`|

## Configuration

The extension searches folders inside `~/Projects`. To change this, update the `BASE_FOLDER` constant in `src/index.tsx`.

## Prerequisites

- [Raycast](https://raycast.com)
- [Zed](https://zed.dev) — the extension uses the `zed` CLI if it's installed at
  `/usr/local/bin/zed`, `/opt/homebrew/bin/zed`, or `~/.local/bin/zed`, and otherwise
  falls back to `open -a "Zed"`. Install the CLI from Zed via **Zed → Install CLI**.

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
