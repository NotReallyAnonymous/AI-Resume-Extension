const extension = globalThis.browser ?? globalThis.chrome;

extension.runtime.onInstalled.addListener(() => {
  console.info('AI Resume Extension installed and ready.');
});

extension.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'PING') {
    sendResponse({ type: 'PONG', source: 'background' });
  }
});
