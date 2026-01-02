# AI Resume Extension

Basic extension boilerplate featuring a popup UI, background worker, and content script wiring.

## Structure
- `manifest.json`: Extension manifest (v3) for Chromium-based browsers.
- `manifest.firefox.json`: Manifest (v2) tailored for Firefox with an equivalent feature set.
- `background.js`: Handles lifecycle events and message responses.
- `content.js`: Injected into pages; responds to pings and triggers downloads.
- `popup.html`, `popup.js`, `styles.css`: Popup UI with ping and JSON download flows.

## Getting started (Chrome)
1. Open `chrome://extensions/` in Chrome.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select this folder.
4. Pin the extension and open the popup to test the Ping and Download flows (check the console for logs).

## Getting started (Firefox)
1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on**.
3. Choose `manifest.firefox.json` from this folder (Firefox will load the rest of the files automatically).
4. Open the popup to test the Ping and Download flows on supported sites (e.g., Indeed).

> Icons are not included. Add your own icon assets and reference them in the manifests if desired.
