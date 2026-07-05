const passwordPolicyMessage = 'Password မှာ အနည်းဆုံး ၈ လုံး၊ English စာလုံးကြီး၊ စာလုံးငယ်၊ နံပါတ်နဲ့ symbol ပါရပါမယ်။ Space မပါရပါ။';
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])\S{8,}$/;
const interfaceStyleId = 'marketpilot-global-interface-fixes';
const pageControlsId = 'marketpilot-page-controls';
const backControlId = 'marketpilot-back-control';

function findAuthForm() {
  return document.querySelector<HTMLFormElement>('.auth-form');
}

function applySignupPasswordPolicy() {
  const form = findAuthForm();
  if (!form) return;

  const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');
  const passwordInput = form.querySelector<HTMLInputElement>('input[autocomplete="new-password"]');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!emailInput || !passwordInput || !submitButton) return;

  passwordInput.minLength = 8;
  passwordInput.title = passwordPolicyMessage;
  passwordInput.placeholder = 'Aa1! ပါတဲ့ အနည်းဆုံး ၈ လုံး';

  const passwordReady = passwordRule.test(passwordInput.value);
  const emailReady = emailInput.checkValidity();
  passwordInput.setCustomValidity(passwordInput.value && !passwordReady ? passwordPolicyMessage : '');
  submitButton.disabled = !(emailReady && passwordReady);
}

function blockWeakSignup(event: Event) {
  const form = findAuthForm();
  if (!form || event.target !== form) return;

  const passwordInput = form.querySelector<HTMLInputElement>('input[autocomplete="new-password"]');
  if (!passwordInput || passwordRule.test(passwordInput.value)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  passwordInput.setCustomValidity(passwordPolicyMessage);
  passwordInput.reportValidity();
}

function getThemeMode() {
  const fromHtml = document.documentElement.dataset.theme;
  if (fromHtml === 'dark' || fromHtml === 'light') return fromHtml;
  const fromStorage = window.localStorage.getItem('marketpilot-theme');
  return fromStorage === 'dark' ? 'dark' : 'light';
}

function setThemeMode(nextTheme: 'light' | 'dark') {
  window.localStorage.setItem('marketpilot-theme', nextTheme);
  document.documentElement.dataset.theme = nextTheme;
  document.querySelector('.app-shell')?.classList.remove('theme-light', 'theme-dark');
  document.querySelector('.app-shell')?.classList.add(`theme-${nextTheme}`);
  updateControlLabels();
}

function getLanguageMode() {
  return window.localStorage.getItem('marketpilot-language') === 'my' ? 'my' : 'en';
}

function setLanguageMode(nextLanguage: 'en' | 'my') {
  window.localStorage.setItem('marketpilot-language', nextLanguage);
  document.documentElement.dataset.marketpilotLanguage = nextLanguage;
  updateControlLabels();
}

function updateControlLabels() {
  const controls = document.getElementById(pageControlsId);
  if (!controls) return;

  const languageButton = controls.querySelector<HTMLButtonElement>('[data-marketpilot-action="language"]');
  const themeButton = controls.querySelector<HTMLButtonElement>('[data-marketpilot-action="theme"]');
  if (languageButton) languageButton.textContent = getLanguageMode() === 'en' ? 'မြန်မာ' : 'English';
  if (themeButton) themeButton.textContent = getThemeMode() === 'light' ? 'Dark mode' : 'Light mode';
}

function clickNativeBackOrFallback() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
  const nativeBack = buttons.find((button) => button.id !== backControlId && /back/i.test(button.textContent ?? ''));
  if (nativeBack) {
    nativeBack.click();
    return;
  }

  const editButton = buttons.find((button) => /edit/i.test(button.textContent ?? ''));
  if (editButton) {
    editButton.click();
    return;
  }

  window.location.reload();
}

function isSignupPageVisible() {
  return Boolean(document.querySelector('.signup-page'));
}

function ensureGlobalInterfaceStyles() {
  if (document.getElementById(interfaceStyleId)) return;

  const style = document.createElement('style');
  style.id = interfaceStyleId;
  style.textContent = `
    .marketpilot-page-controls {
      position: fixed;
      top: 22px;
      right: 28px;
      z-index: 1000;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border: 1px solid rgba(0, 97, 89, 0.12);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 16px 44px rgba(26, 28, 27, 0.08);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .marketpilot-page-controls button,
    .marketpilot-back-control {
      min-height: 42px;
      padding: 0 16px;
      color: var(--ink) !important;
      border: 1px solid rgba(0, 97, 89, 0.14);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
      font-family: Manrope, sans-serif;
      font-size: 13px;
      font-weight: 900;
      box-shadow: none;
    }

    .marketpilot-back-control {
      position: fixed;
      top: 22px;
      left: 28px;
      z-index: 1000;
      min-width: 96px;
      color: var(--primary) !important;
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .marketpilot-page-controls button:hover,
    .marketpilot-back-control:hover {
      transform: translateY(-1px);
      border-color: rgba(0, 97, 89, 0.32);
    }

    :root[data-theme='dark'] .marketpilot-page-controls,
    :root[data-theme='dark'] .marketpilot-back-control {
      border-color: rgba(226, 242, 236, 0.14);
      background: rgba(13, 24, 22, 0.78);
    }

    :root[data-theme='dark'] .marketpilot-page-controls button,
    :root[data-theme='dark'] .marketpilot-back-control {
      color: var(--ink) !important;
      border-color: rgba(226, 242, 236, 0.16);
      background: rgba(255, 255, 255, 0.08);
    }

    input, textarea, .chip, .platform-card, .product-card, .panel, .glass, .ready-note {
      color: var(--ink);
    }

    .section-head p,
    .page-header p,
    .dna-overview p,
    .brand-preview-name small,
    .platform-card small,
    .ready-note,
    .field-hint,
    .dev-note {
      color: var(--muted) !important;
    }

    .chip-active {
      color: #ffffff !important;
      background: var(--primary) !important;
      border-color: var(--primary) !important;
    }

    :root[data-theme='dark'] .chip-active {
      color: #07110f !important;
      background: var(--primary-2) !important;
      border-color: var(--primary-2) !important;
    }

    :root[data-theme='dark'] .glass,
    :root[data-theme='dark'] .panel,
    :root[data-theme='dark'] .dna-overview,
    :root[data-theme='dark'] .product-card,
    :root[data-theme='dark'] .platform-card,
    :root[data-theme='dark'] .brand-preview-name,
    :root[data-theme='dark'] .setup-metrics div {
      color: var(--ink) !important;
      background-color: rgba(13, 24, 22, 0.78);
      border-color: rgba(226, 242, 236, 0.14) !important;
    }

    :root[data-theme='dark'] input,
    :root[data-theme='dark'] textarea {
      color: var(--ink) !important;
      background: rgba(255, 255, 255, 0.07) !important;
      border-color: rgba(226, 242, 236, 0.18) !important;
    }

    :root[data-theme='dark'] input::placeholder,
    :root[data-theme='dark'] textarea::placeholder {
      color: rgba(245, 250, 247, 0.54) !important;
    }

    :root[data-theme='dark'] .primary-btn {
      color: #06120f !important;
      background: var(--primary-2) !important;
    }

    :root[data-theme='dark'] .ghost-btn {
      color: var(--primary-2) !important;
      border-color: rgba(40, 225, 207, 0.38) !important;
    }

    @media (max-width: 720px) {
      .marketpilot-page-controls {
        top: 14px;
        right: 14px;
        gap: 6px;
        padding: 6px;
      }

      .marketpilot-page-controls button,
      .marketpilot-back-control {
        min-height: 38px;
        padding: 0 12px;
        font-size: 12px;
      }

      .marketpilot-back-control {
        top: 14px;
        left: 14px;
        min-width: 78px;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensurePageControls() {
  ensureGlobalInterfaceStyles();

  if (isSignupPageVisible()) {
    document.getElementById(pageControlsId)?.remove();
    document.getElementById(backControlId)?.remove();
    return;
  }

  let controls = document.getElementById(pageControlsId);
  if (!controls) {
    controls = document.createElement('div');
    controls.id = pageControlsId;
    controls.className = 'marketpilot-page-controls';
    controls.innerHTML = '<button type="button" data-marketpilot-action="language"></button><button type="button" data-marketpilot-action="theme"></button>';
    document.body.appendChild(controls);

    controls.querySelector<HTMLButtonElement>('[data-marketpilot-action="language"]')?.addEventListener('click', () => {
      setLanguageMode(getLanguageMode() === 'en' ? 'my' : 'en');
    });

    controls.querySelector<HTMLButtonElement>('[data-marketpilot-action="theme"]')?.addEventListener('click', () => {
      setThemeMode(getThemeMode() === 'light' ? 'dark' : 'light');
    });
  }

  let backControl = document.getElementById(backControlId) as HTMLButtonElement | null;
  if (!backControl) {
    backControl = document.createElement('button');
    backControl.id = backControlId;
    backControl.className = 'marketpilot-back-control';
    backControl.type = 'button';
    backControl.textContent = 'Back';
    backControl.addEventListener('click', clickNativeBackOrFallback);
    document.body.appendChild(backControl);
  }

  updateControlLabels();
}

if (typeof window !== 'undefined') {
  document.addEventListener('input', () => window.setTimeout(applySignupPasswordPolicy, 0), true);
  document.addEventListener('change', () => window.setTimeout(applySignupPasswordPolicy, 0), true);
  document.addEventListener('submit', blockWeakSignup, true);
  window.addEventListener('load', () => {
    applySignupPasswordPolicy();
    ensurePageControls();
  });
  new MutationObserver(() => {
    applySignupPasswordPolicy();
    ensurePageControls();
  }).observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(() => {
    applySignupPasswordPolicy();
    ensurePageControls();
  }, 500);
}
