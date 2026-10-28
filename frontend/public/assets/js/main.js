import { initFeedback } from './feedback.js';
import { initLangToggle } from './i18n/index.js';
import { initQuickSend } from './quick-send.js';
import { initTermsModal } from './terms-modal.js';
import { initThemeToggle } from './theme.js';
import { initTracking } from './tracking.js';

initThemeToggle();
initLangToggle();
initTracking();
initQuickSend();
initFeedback();
initTermsModal();

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('[data-action="toggle-mobile-menu"]');
const mobileMenu = document.querySelector('#mobile-menu');
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const expanded = !mobileMenu.classList.contains('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', String(expanded));
  });

  // Close mobile menu when clicking nav links or quick-send buttons
  mobileMenu.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
