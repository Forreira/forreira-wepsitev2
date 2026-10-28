import ar from './ar.js';
import en from './en.js';

const dictionaries = { ar, en };

export function getLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'ar';
}

export function t(key, params = {}) {
  const currentLang = getLang();
  const dict = dictionaries[currentLang] || dictionaries.ar;
  let str = dict[key];

  if (str === undefined) {
    str = dictionaries.ar[key] !== undefined ? dictionaries.ar[key] : key;
  }

  if (typeof str !== 'string') return str;

  return str.replace(/{([^{}]+)}/g, (match, paramName) => {
    const val = params[paramName.trim()];
    return val !== undefined ? String(val) : match;
  });
}

export function applyTranslations(root = document) {
  const lang = getLang();

  // Text content
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      if (el.tagName === 'TITLE') {
        document.title = t(key);
      } else {
        el.textContent = t(key);
      }
    }
  });

  // Safe innerHTML from dictionaries for formatted copy (e.g. bolded spans)
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (key) {
      el.innerHTML = t(key);
    }
  });

  // Placeholder
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });

  // Aria label
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (key) el.setAttribute('aria-label', t(key));
  });

  // Title attribute
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });

  // Meta content (e.g. description)
  root.querySelectorAll('[data-i18n-content]').forEach((el) => {
    const key = el.getAttribute('data-i18n-content');
    if (key) el.setAttribute('content', t(key));
  });

  // Update language toggle buttons
  const targetLabel = t('lang.switchTo');
  const toggleAria = t('lang.toggleAria');
  root.querySelectorAll('[data-action="toggle-lang"]').forEach((btn) => {
    btn.textContent = targetLabel;
    btn.setAttribute('aria-label', toggleAria);
    btn.title = toggleAria;
  });
}

export function setLang(newLang) {
  const lang = newLang === 'en' ? 'en' : 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

  try {
    localStorage.setItem('forreira_lang', lang);
  } catch (e) {
    // Ignore localStorage errors
  }

  applyTranslations();

  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

export function toggleLang() {
  setLang(getLang() === 'ar' ? 'en' : 'ar');
}

export function initLangToggle() {
  applyTranslations();

  document.querySelectorAll('[data-action="toggle-lang"]').forEach((btn) => {
    btn.removeEventListener('click', toggleLang);
    btn.addEventListener('click', toggleLang);
  });
}
