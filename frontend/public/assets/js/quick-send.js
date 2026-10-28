import { publicApi } from './api.js';
import { t } from './i18n/index.js';
import { $, escapeHtml, showMessage } from './ui.js';

let lastCreatedCode = null;

function readForm(form) {
  const data = Object.fromEntries(new FormData(form));
  for (const key of Object.keys(data)) data[key] = String(data[key]).trim();
  if (!data.mapsUrl) delete data.mapsUrl; // optional field
  return data;
}

export function initQuickSend() {
  const section = $('#quick-send-section');
  const form = $('#quickSendForm');
  const result = $('#quickSendResult');

  document.querySelectorAll('[data-action="toggle-quick-send"]').forEach((trigger) =>
    trigger.addEventListener('click', () => {
      section.classList.toggle('hidden');
      if (!section.classList.contains('hidden')) section.scrollIntoView({ behavior: 'smooth' });
    }),
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const { trackingCode } = await publicApi.createShipment(readForm(form));
      lastCreatedCode = trackingCode;
      showMessage(
        result,
        t('quickSend.success', { trackingCode: escapeHtml(trackingCode) }),
        'success',
      );
      form.reset();
    } catch (error) {
      lastCreatedCode = null;
      showMessage(result, escapeHtml(error.message), 'error');
    } finally {
      submit.disabled = false;
    }
  });

  document.addEventListener('languagechange', () => {
    if (lastCreatedCode && !result.classList.contains('hidden')) {
      showMessage(
        result,
        t('quickSend.success', { trackingCode: escapeHtml(lastCreatedCode) }),
        'success',
      );
    }
  });
}
