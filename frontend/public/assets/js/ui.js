import { getLang } from './i18n/index.js';

export const $ = (selector, root = document) => root.querySelector(selector);

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

export function formatDate(iso) {
  const locale = getLang() === 'en' ? 'en-GB' : 'ar-EG';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

/** Shows a message box with a success or error style. */
export function showMessage(box, html, type = 'info') {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800/80',
    error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/80',
    info: 'bg-white text-darkText border-gray-200 dark:bg-[#0E1D3F] dark:text-[#F4F6FA] dark:border-[#22335C]',
  };
  box.className = `mt-4 p-4 rounded-xl border font-semibold text-center ${styles[type]}`;
  box.innerHTML = html;
}
