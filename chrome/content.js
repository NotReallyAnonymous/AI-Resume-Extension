(() => {
  const extension = globalThis.browser ?? globalThis.chrome;
  const tag = '[AI Resume Extension]';

  if (window.__aiResumeInjected) {
    console.debug(`${tag} content script already injected.`);
    return;
  }

  window.__aiResumeInjected = true;
  console.info(`${tag} content script active.`);

  const extractIndeedJob = () => {
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

    return { status: 'success', job };
  };

  const extractJob = () => {
    const hostname = window.location.hostname;

    if (hostname.includes('linkedin.com')) {
      // TODO: Implement LinkedIn parsing logic.
      return { status: 'unsupported', site: 'linkedin' };
    }

    if (!hostname.includes('indeed.com')) {
      return { status: 'unsupported', site: hostname };
    }

    const jobResult = extractIndeedJob();
    if (!jobResult || jobResult.status !== 'success') {
      return jobResult ?? { status: 'error', reason: 'Unknown extraction error' };
    }

    return jobResult;
  };

  extension.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'PING') {
      sendResponse({ type: 'PONG', source: 'content' });
      return;
    }

    if (message?.type === 'EXTRACT_JOB') {
      const result = extractJob();
      sendResponse(result);
    }
  });
})();
