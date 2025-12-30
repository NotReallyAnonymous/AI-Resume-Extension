chrome.runtime.onInstalled.addListener(() => {
  console.info('AI Resume Extension installed and ready.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'PING') {
    sendResponse({ type: 'PONG', source: 'background' });
  }
});
