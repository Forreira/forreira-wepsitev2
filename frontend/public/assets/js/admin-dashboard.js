import { adminApi, session } from './api.js';
import { initLangToggle, t } from './i18n/index.js';
import { STATUS_BADGE_CLASSES, STATUS_KEYS, STATUS_LABELS } from './statuses.js';
import { initThemeToggle } from './theme.js';
import { $, escapeHtml, formatDate } from './ui.js';

const PAGE_SIZE = 20;
const state = { page: 1, status: '', total: 0 };
let currentItems = [];

if (!session.get()) location.replace('/admin/login.html');

initThemeToggle();
initLangToggle();

const rows = $('#rows');
const filter = $('#statusFilter');
const pageInfo = $('#pageInfo');
const errorBox = $('#error');

function statusOptions(selected) {
  return STATUS_KEYS.map((value) => {
    const isSelected = value === selected ? 'selected' : '';
    return `<option value="${value}" ${isSelected}>${escapeHtml(STATUS_LABELS[value])}</option>`;
  }).join('');
}

function updateFilterDropdown() {
  const currentVal = filter.value || state.status;
  filter.innerHTML = `<option value="">${escapeHtml(t('admin.allStatuses'))}</option>${statusOptions(currentVal)}`;
  filter.value = currentVal;
}

function renderRow(shipment) {
  return `
    <tr class="border-b border-gray-100 dark:border-[#22335C] align-top hover:bg-gray-50/50 dark:hover:bg-[#14264F]/50 transition" data-id="${shipment.id}">
      <td class="p-3 font-bold text-darkText dark:text-darkTextMain">${escapeHtml(shipment.trackingCode)}</td>
      <td class="p-3 text-darkText dark:text-darkTextMain">${escapeHtml(shipment.senderName)}<br><span class="text-gray-400 dark:text-darkMuted text-xs">${escapeHtml(shipment.senderPhone)}</span></td>
      <td class="p-3 text-darkText dark:text-darkTextMain">${escapeHtml(shipment.receiverName)}<br><span class="text-gray-400 dark:text-darkMuted text-xs">${escapeHtml(shipment.receiverPhone)}</span></td>
      <td class="p-3 text-sm text-darkText dark:text-darkTextMain">${escapeHtml(shipment.itemType)}</td>
      <td class="p-3"><span class="${STATUS_BADGE_CLASSES[shipment.status]} text-xs px-2.5 py-1 rounded-full font-bold">${escapeHtml(STATUS_LABELS[shipment.status])}</span></td>
      <td class="p-3 text-xs text-gray-500 dark:text-darkMuted">${formatDate(shipment.createdAt)}</td>
      <td class="p-3">
        <div class="flex gap-2 flex-wrap items-center">
          <select class="status-select border border-gray-300 dark:border-[#22335C] bg-white dark:bg-[#07122B] text-darkText dark:text-darkTextMain rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-primary focus:outline-none">${statusOptions(shipment.status)}</select>
          <input class="note-input border border-gray-300 dark:border-[#22335C] bg-white dark:bg-[#07122B] text-darkText dark:text-darkTextMain placeholder-gray-400 dark:placeholder-darkMuted rounded-lg px-2 py-1 text-sm w-40 focus:ring-1 focus:ring-primary focus:outline-none" maxlength="200" placeholder="${escapeHtml(t('admin.notePlaceholder'))}">
          <button class="save-btn bg-primary hover:bg-orange-600 text-white rounded-lg px-3 py-1 text-sm font-bold transition disabled:opacity-50 cursor-pointer">${escapeHtml(t('admin.save'))}</button>
        </div>
      </td>
    </tr>`;
}

function updatePageInfo() {
  const pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
  pageInfo.textContent = t('admin.pageInfo', { page: state.page, pages, total: state.total });
  $('#prev').disabled = state.page <= 1;
  $('#next').disabled = state.page >= pages;
}

function renderTableRows(items) {
  if (items.length) {
    rows.innerHTML = items.map(renderRow).join('');
  } else {
    rows.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-gray-400 dark:text-darkMuted">${escapeHtml(t('admin.empty'))}</td></tr>`;
  }
}

async function load() {
  errorBox.classList.add('hidden');
  try {
    const { items, total } = await adminApi.listShipments(state);
    currentItems = items;
    state.total = total;
    renderTableRows(items);
    updatePageInfo();
  } catch (error) {
    if (error.status === 401) return logout();
    errorBox.textContent = error.message;
    errorBox.classList.remove('hidden');
  }
}

function logout() {
  session.clear();
  location.replace('/admin/login.html');
}

rows.addEventListener('click', async (event) => {
  const button = event.target.closest('.save-btn');
  if (!button) return;
  const row = button.closest('tr');
  button.disabled = true;
  try {
    await adminApi.updateStatus(row.dataset.id, {
      status: $('.status-select', row).value,
      note: $('.note-input', row).value.trim() || undefined,
    });
    await load();
  } catch (error) {
    if (error.status === 401) return logout();
    errorBox.textContent = error.message;
    errorBox.classList.remove('hidden');
    button.disabled = false;
  }
});

updateFilterDropdown();
filter.addEventListener('change', () => {
  state.status = filter.value;
  state.page = 1;
  load();
});

$('#prev').addEventListener('click', () => {
  if (state.page > 1) {
    state.page -= 1;
    load();
  }
});

$('#next').addEventListener('click', () => {
  const pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
  if (state.page < pages) {
    state.page += 1;
    load();
  }
});

$('#logout').addEventListener('click', logout);

document.addEventListener('languagechange', () => {
  updateFilterDropdown();
  renderTableRows(currentItems);
  updatePageInfo();
});

load();
