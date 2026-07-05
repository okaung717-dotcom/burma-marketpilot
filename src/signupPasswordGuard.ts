const passwordPolicyMessage = 'Password မှာ အနည်းဆုံး ၈ လုံး၊ English စာလုံးကြီး၊ စာလုံးငယ်၊ နံပါတ်နဲ့ symbol ပါရပါမယ်။ Space မပါရပါ။';
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])\S{8,}$/;

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

if (typeof window !== 'undefined') {
  document.addEventListener('input', () => window.setTimeout(applySignupPasswordPolicy, 0), true);
  document.addEventListener('change', () => window.setTimeout(applySignupPasswordPolicy, 0), true);
  document.addEventListener('submit', blockWeakSignup, true);
  window.addEventListener('load', applySignupPasswordPolicy);
  new MutationObserver(applySignupPasswordPolicy).observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(applySignupPasswordPolicy, 500);
}
