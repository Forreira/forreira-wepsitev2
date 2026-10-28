import { adminApi, session } from './api.js';
import { initLangToggle } from './i18n/index.js';
import { initThemeToggle } from './theme.js';
import { $, escapeHtml, showMessage } from './ui.js';

if (session.get()) location.replace('/admin/');

initThemeToggle();
initLangToggle();

const form = $('#loginForm');
const result = $('#loginResult');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  try {
    const { accessToken } = await adminApi.login(Object.fromEntries(new FormData(form)));
    session.set(accessToken);
    location.replace('/admin/');
  } catch (error) {
    showMessage(result, escapeHtml(error.message), 'error');
    submit.disabled = false;
  }
});
