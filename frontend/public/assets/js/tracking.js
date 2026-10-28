import { publicApi } from './api.js';
import { t } from './i18n/index.js';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './statuses.js';
import { $, escapeHtml, formatDate, showMessage } from './ui.js';

let lastShipment = null;

function renderShipment(shipment) {
  const events = shipment.events
    .map(
      (event) => `
        <li class="flex justify-between gap-4 text-sm border-b border-gray-100 dark:border-[#22335C] pb-2">
          <span><strong class="text-darkText dark:text-darkTextMain">${escapeHtml(STATUS_LABELS[event.status])}</strong>
            ${event.note ? `<span class="text-gray-500 dark:text-darkMuted"> — ${escapeHtml(event.note)}</span>` : ''}</span>
          <span class="text-gray-400 dark:text-darkMuted whitespace-nowrap text-xs">${formatDate(event.createdAt)}</span>
        </li>`,
    )
    .join('');

  return `
    <div class="space-y-3 text-start">
      <div class="flex justify-between items-center border-b border-gray-100 dark:border-[#22335C] pb-2">
        <span class="text-gray-500 dark:text-darkMuted text-sm">${t('tracking.codeLabel')} <strong class="text-darkText dark:text-darkTextMain">${escapeHtml(shipment.trackingCode)}</strong></span>
        <span class="${STATUS_BADGE_CLASSES[shipment.status]} text-xs px-2.5 py-1 rounded-full font-bold">${escapeHtml(STATUS_LABELS[shipment.status])}</span>
      </div>
      <ul class="space-y-2">${events}</ul>
    </div>`;
}

export function initTracking() {
  const input = $('#trackInput');
  const button = $('#trackButton');
  const result = $('#trackResult');

  async function track() {
    const code = input.value.trim();
    if (!code) {
      lastShipment = null;
      showMessage(result, t('tracking.required'), 'error');
      return;
    }
    button.disabled = true;
    try {
      const shipment = await publicApi.track(code);
      lastShipment = shipment;
      showMessage(result, renderShipment(shipment), 'info');
    } catch (error) {
      lastShipment = null;
      showMessage(result, escapeHtml(error.message), 'error');
    } finally {
      button.disabled = false;
    }
  }

  button.addEventListener('click', track);
  input.addEventListener('keydown', (event) => event.key === 'Enter' && track());

  document.addEventListener('languagechange', () => {
    if (lastShipment && !result.classList.contains('hidden')) {
      showMessage(result, renderShipment(lastShipment), 'info');
    }
  });
}
