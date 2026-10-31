import { t } from './i18n/index.js';
import { $, escapeHtml, showMessage } from './ui.js';

let lastSubmittedSuccess = false;

export function initFeedback() {
  const form = $('#feedbackForm');
  const result = $('#feedbackResult');
  const roleInput = $('#feedbackUserRole');
  const typeInput = $('#feedbackType');

  if (!form) return;

  const roleBtns = form.querySelectorAll('[data-role-btn]');
  const typeBtns = form.querySelectorAll('[data-type-btn]');

  const activeClasses = ['border', 'border-primary', 'bg-primary', 'text-white', 'shadow-lg', 'shadow-orange-500/25', 'font-black'];
  const inactiveClasses = ['border', 'border-gray-200', 'dark:border-white/10', 'bg-gray-100', 'dark:bg-white/5', 'text-gray-700', 'dark:text-gray-300', 'hover:border-primary/40', 'font-bold'];
  const legacyClasses = ['border-2', 'border-white', 'bg-white', 'text-primary', 'shadow-md', 'bg-[#07122B]', 'text-gray-200', 'border-white/20', 'bg-primary/20', 'dark:bg-primary/25', 'dark:text-white', 'border-slate-700/60', 'dark:border-darkBorder', 'bg-slate-800/60', 'text-slate-300', 'dark:text-darkMuted', 'border-gray-200', 'bg-gray-50'];

  // Role button selection
  roleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role-btn');
      roleInput.value = role;

      roleBtns.forEach((b) => {
        b.classList.remove(...activeClasses, ...legacyClasses);
        b.classList.add(...inactiveClasses);
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.remove(...inactiveClasses, ...legacyClasses);
      btn.classList.add(...activeClasses);
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  // Type button selection
  typeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type-btn');
      typeInput.value = type;

      typeBtns.forEach((b) => {
        b.classList.remove(...activeClasses, ...legacyClasses);
        b.classList.add(...inactiveClasses);
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.remove(...inactiveClasses, ...legacyClasses);
      btn.classList.add(...activeClasses);
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  // Form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone || !message) {
      showMessage(result, t('feedback.validationError'), 'error');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2" aria-hidden="true"></i> ...';

    // Simulate reliable dispatch
    await new Promise((resolve) => setTimeout(resolve, 600));

    lastSubmittedSuccess = true;
    showMessage(result, t('feedback.success'), 'success');

    // Reset inputs but preserve current category & role
    form.querySelector('[name="name"]').value = '';
    form.querySelector('[name="phone"]').value = '';
    form.querySelector('[name="message"]').value = '';

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
  });

  document.addEventListener('languagechange', () => {
    if (lastSubmittedSuccess && result && !result.classList.contains('hidden')) {
      showMessage(result, t('feedback.success'), 'success');
    }
  });
}
