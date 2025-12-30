const responseEl = document.getElementById('response');
const pingButton = document.getElementById('ping');

const setResponse = (text) => {
  responseEl.textContent = text;
};

pingButton?.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setResponse('No active tab found.');
      return;
    }

    const [contentResult] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => 'content-ready'
    });

    if (contentResult?.result !== 'content-ready') {
      setResponse('Content script not available.');
      return;
    }

    const reply = await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
    setResponse(`Response from ${reply?.source ?? 'unknown'}`);
  } catch (error) {
    console.error('Ping failed', error);
    setResponse('Ping failed. Check the console for details.');
  }
});
