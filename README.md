# AI Resume Extension

Basic extension boilerplate featuring a popup UI, background worker, and content script wiring.

## Structure
- `chrome/`: Chromium/Chrome extension (Manifest v3).
  - `manifest.json`: Manifest v3 for Chromium-based browsers.
  - `background.js`: Handles lifecycle events and message responses.
  - `content.js`: Injected into pages; responds to pings and returns job data.
  - `popup.html`, `popup.js`, `styles.css`: Popup UI with ping and JSON download flows (download now initiated from the popup).
- `firefox/`: Firefox extension (Manifest v2).
  - `manifest.json`: Manifest v2 tailored for Firefox.
  - Other scripts mirror the Chrome build for feature parity.

## Getting started (Chrome)
1. Open `chrome://extensions/` in Chrome.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select the `chrome` folder.
4. Pin the extension and open the popup to test the Ping and Download flows (check the console for logs).

## Getting started (Firefox)
1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on**.
3. Choose `manifest.json` from the `firefox` folder (Firefox will load the rest of the files automatically).
4. Open the popup to test the Ping and Download flows on supported sites (e.g., Indeed).

> Icons are not included. Add your own icon assets and reference them in the manifests if desired.
