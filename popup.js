const responseEl = document.getElementById('response');
const pingButton = document.getElementById('ping');
const downloadButton = document.getElementById('download-indeed');

const setResponse = (text) => {
  responseEl.textContent = text;
};

const ensureContentReady = async (tabId) => {
  const [contentResult] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => 'content-ready'
  });

  return contentResult?.result === 'content-ready';
};

pingButton?.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setResponse('No active tab found.');
      return;
    }

    const contentReady = await ensureContentReady(tab.id);
    if (!contentReady) {
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

downloadButton?.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setResponse('No active tab found.');
      return;
    }

    const contentReady = await ensureContentReady(tab.id);
    if (!contentReady) {
      setResponse('Content script not available.');
      return;
    }

    const [{ result } = {}] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const hostname = window.location.hostname;

        if (hostname.includes('linkedin.com')) {
          // TODO: Implement LinkedIn parsing logic.
          return { status: 'unsupported', site: 'linkedin' };
        }

        if (!hostname.includes('indeed.com')) {
          return { status: 'unsupported', site: hostname };
        }

        const container = document.querySelector('.jobsearch-JobComponent');
        if (!container) {
          console.warn('Job container not found.');
          return { status: 'error', reason: 'Job container not found' };
        }

        const titleEl = container.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]');
        const companyEl = container.querySelector('a.css-1h4l2d7');
        const salaryEl = container.querySelector('#salaryInfoAndJobType .css-1oc7tea');
        const descriptionEl = container.querySelector('#jobDescriptionText');

        const job = {};

        if (titleEl?.textContent?.trim()) {
          job.title = titleEl.textContent.trim();
        } else {
          console.warn('Job title not found.');
        }

        if (companyEl?.textContent?.trim()) {
          job.company = companyEl.textContent.trim();
        } else {
          console.warn('Company name not found.');
        }

        if (salaryEl?.textContent?.trim()) {
          job.salary = salaryEl.textContent.trim();
        } else {
          console.warn('Salary info not found.');
        }

        if (descriptionEl?.innerText?.trim()) {
          job.description = descriptionEl.innerText.trim();
        } else {
          console.warn('Job description not found.');
        }

        if (!Object.keys(job).length) {
          return { status: 'error', reason: 'No job data found' };
        }

        const blob = new Blob([JSON.stringify(job, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'indeed-job.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        return { status: 'success', job };
      }
    });

    if (!result) {
      setResponse('No result from content script.');
      return;
    }

    if (result.status === 'unsupported') {
      setResponse(`Unsupported site: ${result.site}`);
      return;
    }

    if (result.status === 'error') {
      setResponse(`Error: ${result.reason}`);
      return;
    }

    setResponse('Job JSON downloaded.');
  } catch (error) {
    console.error('Download failed', error);
    setResponse('Download failed. Check the console for details.');
  }
});
