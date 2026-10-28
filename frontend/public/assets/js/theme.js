import { t } from './i18n/index.js';

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function updateThemeButtons() {
  const isDark = getTheme() === 'dark';
  const label = t('theme.toggle');

  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', label);
    btn.title = label;

    // Use Font Awesome icons with smooth visual appearance
    if (isDark) {
      btn.innerHTML = '<i class="fa-solid fa-sun text-amber-400 text-base" aria-hidden="true"></i>';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-moon text-slate-700 text-base" aria-hidden="true"></i>';
    }
  });
}

export function setTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  try {
    localStorage.setItem('forreira_theme', isDark ? 'dark' : 'light');
  } catch (e) {
    // Graceful fallback if localStorage is unavailable
  }

  updateThemeButtons();
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function initThemeToggle() {
  updateThemeButtons();

  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });

  document.addEventListener('languagechange', () => {
    updateThemeButtons();
  });
}
