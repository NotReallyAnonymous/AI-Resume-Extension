const extension = globalThis.browser ?? globalThis.chrome;

const responseEl = document.getElementById('response');
const pingButton = document.getElementById('ping');
const downloadButton = document.getElementById('download-indeed');
const resumeUploadInput = document.getElementById('resume-upload');
const resumeStatusEl = document.getElementById('resume-status');

const setResponse = (text) => {
  responseEl.textContent = text;
};

const setResumeStatus = (text) => {
  if (resumeStatusEl) {
    resumeStatusEl.textContent = text;
  }
};

const readFileAsJSON = async (file) => {
  const text = await file.text();
  return JSON.parse(text);
};

const getStoredResume = async () => {
  const result = await extension.storage.local.get('resumeData');
  if (
    result?.resumeData &&
    typeof result.resumeData === 'object' &&
    !Array.isArray(result.resumeData)
  ) {
    return result.resumeData;
  }

  return {};
};

resumeUploadInput?.addEventListener('change', async (event) => {
  try {
    const [file] = event.target.files || [];
    if (!file) {
      setResumeStatus('No file selected.');
      return;
    }

    const resumeData = await readFileAsJSON(file);
    if (!resumeData || typeof resumeData !== 'object' || Array.isArray(resumeData)) {
      throw new Error('Resume JSON must be an object.');
    }

    await extension.storage.local.set({ resumeData });
    setResumeStatus('Resume saved. Upload a new file to overwrite.');
    event.target.value = '';
  } catch (error) {
    console.error('Resume upload failed', error);
    setResumeStatus(error?.message ?? 'Invalid JSON file. Please try again.');
  }
});

pingButton?.addEventListener('click', async () => {
  try {
    const [tab] = await extension.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setResponse('No active tab found.');
      return;
    }

    const reply = await extension.tabs.sendMessage(tab.id, { type: 'PING' });
    setResponse(`Response from ${reply?.source ?? 'unknown'}`);
  } catch (error) {
    console.error('Ping failed', error);
    setResponse('Ping failed. Check the console for details.');
  }
});

downloadButton?.addEventListener('click', async () => {
  try {
    const [tab] = await extension.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setResponse('No active tab found.');
      return;
    }

    const resumeData = await getStoredResume();

    const result = await extension.tabs.sendMessage(tab.id, {
      type: 'EXTRACT_JOB',
      resumeData
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

    const payload = {
      resume: resumeData ?? {},
      job: result.job
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'resume-and-job.json';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setResponse('Resume + job JSON downloaded.');
  } catch (error) {
    console.error('Download failed', error);
    setResponse('Download failed. Check the console for details.');
  }
});
