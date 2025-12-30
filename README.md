# AI Resume Extension

Basic Chrome extension boilerplate featuring a popup UI, background service worker, and content script wiring.

## Structure
- `manifest.json`: Extension manifest (v3).
- `background.js`: Handles lifecycle events and message responses.
- `content.js`: Injected into pages; responds to pings.
- `popup.html`, `popup.js`, `styles.css`: Simple popup UI with a ping button.

## Getting started
1. Open `chrome://extensions/` in Chrome.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select this folder.
4. Pin the extension and open the popup to test the Ping flow (check the console for logs).

> Icons are not included. Add your own icon assets and reference them in `manifest.json` if desired.
