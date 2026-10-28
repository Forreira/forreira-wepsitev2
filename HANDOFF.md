# Forreira Website - Developer Handoff

## Dark Mode + i18n

This document describes the front-end Dark Mode and English (i18n) architecture implemented across all three pages of the Forreira website:
- **Public Landing Page:** `frontend/public/index.html`
- **Admin Login:** `frontend/public/admin/login.html`
- **Admin Dashboard:** `frontend/public/admin/index.html`

---

### 1. Dev Convenience (Docker Compose Bind Mount)
In `docker-compose.yml`, a read-only bind mount was added under the `app` service:
```yaml
services:
  app:
    # ...
    volumes:
      - ./frontend:/app/frontend:ro
```
This allows front-end edits made inside `./frontend` to appear immediately on browser refresh without rebuilding the Docker container.

---

### 2. Files Created & Changed

#### Files Created:
1. `frontend/public/assets/js/theme-init.js`: Lightweight synchronous `<head>` script that reads saved theme (`forreira_theme`) or system preference (`prefers-color-scheme`) and sets/removes the `dark` class on `<html>` before the Tailwind CDN and DOM render to prevent any flash of wrong theme.
2. `frontend/public/assets/js/lang-init.js`: Lightweight synchronous `<head>` script that checks `?lang=en|ar` query param, saved preference (`forreira_lang`), or defaults to Arabic, setting `document.documentElement.lang` and `document.documentElement.dir` ('rtl' / 'ltr') before first paint to prevent layout flashes.
3. `frontend/public/assets/js/theme.js`: ES module providing `getTheme()`, `setTheme(theme)`, `toggleTheme()`, and `initThemeToggle()`. Updates all `[data-action="toggle-theme"]` buttons with icons (sun/moon) and accessible `aria-pressed` / `aria-label` attributes.
4. `frontend/public/assets/js/i18n/ar.js`: Complete Arabic translation dictionary containing all source-of-truth copy from the original pages unchanged.
5. `frontend/public/assets/js/i18n/en.js`: Complete natural English translation dictionary tailored for an Egyptian logistics company (using brand "Forreira", slogan "Speed & Guarantee", "EGP", "Shipment", "Tracking number", "Captain", and "Quick send").
6. `frontend/public/assets/js/i18n/index.js`: Translation engine exporting `t(key, params)`, `getLang()`, `setLang(lang)`, `toggleLang()`, `initLangToggle()`, `applyTranslations(root)`, and dispatching custom `languagechange` events on `document`.

#### Files Modified:
1. `docker-compose.yml`: Added `./frontend:/app/frontend:ro` bind mount.
2. `frontend/public/assets/js/tailwind.config.js`: Enabled `darkMode: 'class'`, extended colors with the dark palette tokens (`darkBg: '#07122B'`, `darkCard: '#0E1D3F'`, `darkBorder: '#22335C'`, `darkTextMain: '#F4F6FA'`, `darkMuted: '#A3ADC2'`), and configured font families (`Tajawal` and `Inter`).
3. `frontend/public/assets/js/statuses.js`: Integrated status labels with the i18n dictionary (`t('status.' + code)`) while preserving backward-compatible proxy lookups (`STATUS_LABELS[code]`), and added dark mode styling classes to `STATUS_BADGE_CLASSES`.
4. `frontend/public/assets/js/ui.js`: Localized `formatDate(iso)` using `'en-GB'` for English and `'ar-EG'` for Arabic based on `getLang()`, and updated `showMessage()` styles to support high-contrast dark mode badges.
5. `frontend/public/assets/js/api.js`: Added English error message resolution based on HTTP status code (400, 401, 404, 429, and other) when `getLang() === 'en'`, preserving Arabic backend messages when in Arabic mode.
6. `frontend/public/assets/js/tracking.js`: Integrated `t()` localization, dark mode styling, and dynamic re-rendering on `languagechange` events.
7. `frontend/public/assets/js/quick-send.js`: Localized success messages with parameter interpolation (`{trackingCode}`) and registered `languagechange` listener.
8. `frontend/public/assets/js/main.js`: Initialized theme and language toggle listeners, initialized tracking, quick send, and mobile drawer interaction.
9. `frontend/public/assets/js/admin-login.js`: Initialized theme and language toggle modules for the admin login screen.
10. `frontend/public/assets/js/admin-dashboard.js`: Localized table headers, filter options, status selects, pagination, and dynamic re-rendering on `languagechange`.
11. `frontend/public/index.html`: Loaded initialization scripts, added Inter font, added accessible theme and language toggle buttons to header and mobile drawer, annotated static elements with `data-i18n*` attributes, replaced physical Tailwind utilities with logical RTL/LTR utilities (`ms-`/`me-`, `text-start`/`text-end`, etc.), and added comprehensive dark mode utility classes.
12. `frontend/public/admin/login.html`: Added initialization scripts, theme and language switch buttons in a header bar, `data-i18n` attributes, and full dark mode support.
13. `frontend/public/admin/index.html`: Added initialization scripts, theme and language switch buttons in the header, `data-i18n` attributes, logical table alignments, and full dark mode support.

---

### 3. How the Toggles Work

#### Theme Toggle
1. **Initial Load:** `theme-init.js` runs in `<head>` before Tailwind CDN parses the DOM. It checks `localStorage.getItem('forreira_theme')` or `window.matchMedia('(prefers-color-scheme: dark)')`. If dark, it adds `class="dark"` to `<html>`.
2. **User Interaction:** Clicking any button with `[data-action="toggle-theme"]` calls `toggleTheme()` in `theme.js`.
3. **State Change:** Toggles `dark` class on `<html>`, persists `'dark'` or `'light'` to `localStorage` key `forreira_theme` (safely wrapped in try/catch), updates `aria-pressed="true|false"`, updates the Font Awesome icon (`fa-sun` in dark mode, `fa-moon` in light mode), and updates the translated `aria-label`.

#### Language Switch (Arabic / English)
1. **Initial Load:** `lang-init.js` runs synchronously in `<head>`. Precedence order:
   `?lang=en|ar` query param > `localStorage.getItem('forreira_lang')` > `'ar'` default.
   It sets `document.documentElement.lang` and `document.documentElement.dir` (`'ltr'` for English, `'rtl'` for Arabic) before rendering.
2. **User Interaction:** Clicking any button with `[data-action="toggle-lang"]` toggles between `'ar'` and `'en'`.
3. **State Change:** Updates `lang` and `dir` on `<html>`, persists the choice to `localStorage` key `forreira_lang`, calls `applyTranslations()` across the document, updates button text (showing the alternate language to switch to: "EN" when Arabic, "العربية" when English), and dispatches a `languagechange` custom event on `document`.
4. **Dynamic Subscribers:** Modules rendering dynamic components (`tracking.js`, `quick-send.js`, `admin-dashboard.js`) listen for `languagechange` and update active views (e.g., status badges, table contents, and filter dropdowns).

---

### 4. RTL / LTR Mirroring and Typography
- **Logical Tailwind Utilities:** Converted directional classes:
  - `ml-` / `mr-` → `ms-` / `me-`
  - `pl-` / `pr-` → `ps-` / `pe-`
  - `text-left` / `text-right` → `text-start` / `text-end`
  - `border-l` / `r` → `border-s` / `e`
  - Directional icons use `rtl:inline ltr:hidden` and `ltr:inline rtl:hidden` (or `rtl:rotate-180`).
- **Fonts:**
  - Arabic: **Tajawal** (`sans-serif`)
  - English: **Inter** (`sans-serif`), loaded via Google Fonts `<link>` and applied via `html[lang="en"] body { font-family: 'Inter', sans-serif; }`.

---

### 5. Color Palette & Accessibility Contrast

| Element | Light Mode | Dark Mode | WCAG Contrast |
|---|---|---|---|
| **Page Background** | `#FFFFFF` (`bg-lightBg`) | `#07122B` (`dark:bg-darkBg`) | - |
| **Cards & Surfaces** | `#F8FAFC` (`bg-cardBg`) / `#FFFFFF` | `#0E1D3F` (`dark:bg-darkCard`) | - |
| **Borders** | `#E2E8F0` / `#D1D5DB` | `#22335C` (`dark:border-darkBorder`) | High definition |
| **Main Text** | `#1E293B` (`text-darkText`) | `#F4F6FA` (`dark:text-darkTextMain`) | > 16:1 (AAA) |
| **Muted Text** | `#4B5563` / `#6B7280` | `#A3ADC2` (`dark:text-darkMuted`) | > 6:1 (AA) |
| **Accent Orange** | `#FF5722` (`bg-primary`) | `#FF5722` (`text-primary` / `bg-primary`) | Brand accent |

All forms, inputs, tables, dropdowns, status badges, and messages strictly comply with WCAG AA contrast (≥ 4.5:1).

---

### 6. How to Add a New Translation Key

1. **Add key to Arabic dictionary (`assets/js/i18n/ar.js`):**
   ```javascript
   'newSection.title': 'عنوان القسم الجديد',
   'newSection.greeting': 'مرحباً {name}!',
   ```
2. **Add matching key to English dictionary (`assets/js/i18n/en.js`):**
   ```javascript
   'newSection.title': 'New Section Title',
   'newSection.greeting': 'Hello {name}!',
   ```
3. **Use in Static HTML:**
   - Text content: `<h2 data-i18n="newSection.title">عنوان القسم الجديد</h2>`
   - Placeholder: `<input data-i18n-placeholder="newSection.placeholder" placeholder="...">`
   - Aria Label: `<button data-i18n-aria-label="newSection.btnAria" aria-label="...">`
   - Rich text with formatting: `<p data-i18n-html="newSection.richText">...</p>`
4. **Use in JavaScript Modules:**
   ```javascript
   import { t } from './i18n/index.js';

   const title = t('newSection.title');
   const greeting = t('newSection.greeting', { name: 'Ahmed' });
   ```

---

### 7. Known Limitations
- **Backend API Validation Errors:** The backend (`forreira-website/backend`) validates inputs and generates validation error messages in Arabic. Per project specifications, the backend was kept untouched.
  - In Arabic mode: Server error messages are displayed directly to the user.
  - In English mode: `api.js` intercepts non-2xx responses and maps HTTP status codes (400, 401, 404, 429) to clean English translations defined in `en.js`. Any server-returned Arabic error strings are suppressed in English mode.

---

### 8. Verification & Acceptance Checklist Results

| Acceptance Item | Status | Verified Result |
|---|---|---|
| 1. Dark/light toggle on all 3 pages | **PASSED** | Clean toggle on `index.html`, `admin/login.html`, and `admin/index.html`. Zero white islands in dark mode. |
| 2. Reload persistence & zero flash | **PASSED** | `forreira_theme` and `forreira_lang` preserved in `localStorage`. Synchronous `theme-init.js` and `lang-init.js` prevent FOUC / wrong direction flash. |
| 3. Switch to English & RTL/LTR layout | **PASSED** | `lang="en"`, `dir="ltr"`, layout mirrored correctly (nav order, icons, form fields, table columns, pagination arrows). |
| 4. Zero language leaks | **PASSED** | 100% of visible strings, placeholders, badges, headings, footers, and table columns switch cleanly. |
| 5. Tracking `FOR12345678` & error code | **PASSED** | Tested `FOR12345678` (renders timeline and badges in chosen language). Tested invalid code (returns localized 404 message). |
| 6. Quick send form | **PASSED** | Form validation, labels, placeholders, and dynamic success message verified in both languages. |
---

### 9. New Additions: Fixed SVG Logo, App Downloads, & Complaints/Feedback Section

#### A. Fixed SVG Logos
- Source files from `frontend/public/assets/logo-fixed/logo/`:
  - `forreira-logo.svg`: Light theme logo (Dark text/wing `#202020` + Orange `#FD601C`).
  - `forreira-logo-light.svg`: Dark theme logo (Light text/wing `#F4F6FA` + Orange `#FD601C`).
- Copied to `frontend/public/assets/img/`.
- Updated all 3 pages (`index.html`, `admin/login.html`, `admin/index.html`) using dual responsive `<img>` tags (`dark:hidden` and `hidden dark:block`), removing the oversized white bounding box from the original logo.

#### B. App Download Badges (Google Play & App Store)
- Located directly below the 3 top cards (Merchants, Captains, Quick Send) in `index.html`.
- Also embedded directly within Card 1 (Merchant App) and Card 2 (Captain App).
- Features styled buttons for:
  - **Merchant App (`تطبيق التاجر`):** Google Play & App Store
  - **Captain App (`تطبيق الكابتن`):** Google Play & App Store

#### C. Complaints & Suggestions Section (`#feedback-section`)
- Placed right before the footer with navbar and footer anchor links.
- Matches the requested design reference:
  - Header badge: `صوتك مسموع ويهمنا`
  - Title: `شاركنا رأيك، اقتراحك أو شكواك`
  - Subtitle: `إدارة فوريرة تتابع كل رسالة باهتمام بالغ لتطوير المنظومة وحل أي ملاحظة فوراً.`
  - **Role selector ("أنت تمثل:"):** `تاجر` (Merchant), `كابتن` (Captain), `عميل / زائر` (Customer/Visitor)
  - **Participation type ("نوع المشاركة:"):** `شكوى أو ملاحظة` (Complaint), `اقتراح تطوير` (Suggestion), `طلب شراكة` (Partnership), `استفسار عام` (Inquiry)
  - Fields: Full name (`الاسم الكامل`), Phone / WhatsApp (`رقم الهاتف أو الواتساب`), Message / Complaint (`نص الرسالة أو الشكوى`).
  - Vibrant green submit button (`إرسال الرسالة`) with paper plane icon.
  - Interactive logic in `frontend/public/assets/js/feedback.js` handles client validation, feedback message rendering, and reactive language switching.

