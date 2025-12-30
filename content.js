(() => {
  const tag = '[AI Resume Extension]';

  if (window.__aiResumeInjected) {
    console.debug(`${tag} content script already injected.`);
    return;
  }

  window.__aiResumeInjected = true;
  console.info(`${tag} content script active.`);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'PING') {
      sendResponse({ type: 'PONG', source: 'content' });
    }
  });
})();
