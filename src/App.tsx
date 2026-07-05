import { useEffect, useMemo, useState } from 'react';
import AnalysisLoadingPage from './AnalysisLoading';
import DashboardExperience from './DashboardExperience';
import type { BusinessDraft, ProductDraft, SetupDraft } from './types';

const categories = ['Fashion', 'F&B', 'Beauty', 'Tech Services', 'Retail'];
const frequencies = ['Daily', '2-3 Times a Week', 'Weekly', 'Occasionally'];
const assistanceOptions = ['Content Calendar', 'Captions & Copy', 'Image Generation', 'Audience Engagement'];
const platforms = ['Facebook Page', 'Instagram', 'TikTok', 'Messenger', 'Viber', 'Telegram', 'Website', 'Google Business'];
const createProduct = (): ProductDraft => ({ id: crypto.randomUUID(), name: 'Premium Arabica Blend', category: 'Coffee Beans', price: '25000', usp: 'Locally sourced from Shan State', images: [] });
const initialBusiness: BusinessDraft = { businessName: 'Royal Rangoon Coffee', category: 'F&B', description: 'A premium Myanmar coffee brand serving authentic local beans.', brandVoice: ['Premium'], products: [createProduct()] };
const initialSetup: SetupDraft = { connectedPlatforms: ['Facebook Page'], postingFrequency: '2-3 Times a Week', assistance: ['Captions & Copy', 'Audience Engagement'] };

type AppScreen = 'signup' | 'step1' | 'step2' | 'analyzing' | 'dashboardOpening' | 'dashboard';
type ThemeMode = 'light' | 'dark';
type LanguageMode = 'en' | 'my';
type AuthDraft = { username: string; password: string };

const signupCopy = {
  en: {
    eyebrow: 'Myanmar business AI command center',
    title: 'Turn Business DNA into a daily marketing pilot.',
    description: 'Create your account, add your business data once, and let Burma MarketPilot prepare a practical marketing direction for products, platforms, posts and creative decisions.',
    overviewLabel: 'Service overview',
    services: [
      { badge: '01', title: 'AI Content Calendar', body: 'Plans what to post, where to post, and when to publish for every product campaign.' },
      { badge: '02', title: 'Marketing Direction', body: 'Analyzes business category, product value, audience fit and brand voice before giving action steps.' },
      { badge: '03', title: 'Export-ready Strategy', body: 'Prepares a clear roadmap that can become Google Sheet and PDF-ready marketing work.' },
    ],
    authTitle: 'Create your account',
    authBody: 'Sign up with a user name and password to start a real MarketPilot workspace on this device.',
    username: 'User name',
    usernamePlaceholder: 'e.g. royalrangoon',
    password: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',
    show: 'Show',
    hide: 'Hide',
    submit: 'Sign Up & Start Setup',
    saved: 'Your workspace preferences will be remembered on this browser.',
    error: 'Please enter a user name with at least 3 characters and a password with at least 6 characters.',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    language: 'မြန်မာ',
  },
  my: {
    eyebrow: 'မြန်မာစီးပွားရေး AI Command Center',
    title: 'Business DNA ကနေ နေ့စဉ် Marketing လမ်းညွှန်ကို ဖန်တီးပါ။',
    description: 'Account တစ်ခုဖန်တီးပြီး Business Data ကိုတစ်ကြိမ်ဖြည့်လိုက်တာနဲ့ Burma MarketPilot က Product, Platform, Post နဲ့ Creative Direction အတွက် လက်တွေ့အသုံးဝင်တဲ့ Marketing လမ်းကြောင်းကို ပြင်ဆင်ပေးပါမယ်။',
    overviewLabel: 'Website Service & Overview',
    services: [
      { badge: '01', title: 'AI Content Calendar', body: 'ဘယ်နေ့မှာ ဘာတင်မလဲ၊ ဘယ် Platform မှာ ဘာလုပ်မလဲဆိုတာ Product Campaign အလိုက်စီစဉ်ပေးမယ်။' },
      { badge: '02', title: 'Marketing Direction', body: 'Business Category, Product Value, Customer Audience နဲ့ Brand Voice ကိုစစ်ဆေးပြီး Action Step ပေးမယ်။' },
      { badge: '03', title: 'Export-ready Strategy', body: 'Google Sheet နဲ့ PDF ထုတ်နိုင်တဲ့ Marketing Roadmap ပုံစံအထိ သေချာရှင်းလင်းစီမံပေးမယ်။' },
    ],
    authTitle: 'Account ဖန်တီးပါ',
    authBody: 'User name နဲ့ Password ထည့်ပြီး ဒီ Browser ပေါ်မှာ MarketPilot Workspace ကို စတင်အသုံးပြုပါ။',
    username: 'User name',
    usernamePlaceholder: 'ဥပမာ - royalrangoon',
    password: 'Password',
    passwordPlaceholder: 'အနည်းဆုံး ၆ လုံး',
    show: 'ပြ',
    hide: 'ဖုံး',
    submit: 'Sign Up လုပ်ပြီး Setup စတင်မယ်',
    saved: 'သင့် Workspace Preference တွေကို ဒီ Browser မှာ မှတ်ထားပေးပါမယ်။',
    error: 'User name အနည်းဆုံး ၃ လုံးနဲ့ Password အနည်းဆုံး ၆ လုံး ထည့်ပေးပါ။',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    language: 'English',
  },
};

function getStoredTheme(): ThemeMode {
  const stored = window.localStorage.getItem('marketpilot-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredLanguage(): LanguageMode {
  const stored = window.localStorage.getItem('marketpilot-language');
  return stored === 'my' ? 'my' : 'en';
}

function getStoredUsername() {
  try {
    const stored = window.localStorage.getItem('marketpilot-user');
    if (!stored) return '';
    const parsed = JSON.parse(stored) as { username?: string };
    return parsed.username ?? '';
  } catch {
    return '';
  }
}

function estimateSeconds(business: BusinessDraft, setup: SetupDraft) {
  return Math.min(90, Math.max(24, 18 + business.products.length * 5 + setup.connectedPlatforms.length * 2 + Math.ceil(business.description.length / 90)));
}

function getStage(ratio: number) {
  if (ratio < 0.22) return 1;
  if (ratio < 0.46) return 2;
  if (ratio < 0.7) return 3;
  if (ratio < 0.9) return 4;
  return 5;
}

function BrandMark() {
  return <div className="brand-mark"><span className="brand-icon">MP</span><span>Burma MarketPilot</span><i /></div>;
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button type="button" className={`chip ${active ? 'chip-active' : ''}`} onClick={onClick}>{label}</button>;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('signup');
  const [business, setBusiness] = useState<BusinessDraft>(initialBusiness);
  const [setup, setSetup] = useState<SetupDraft>(initialSetup);
  const [analysisStage, setAnalysisStage] = useState(1);
  const [analysisRemaining, setAnalysisRemaining] = useState(0);
  const [analysisTotal, setAnalysisTotal] = useState(0);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [language, setLanguage] = useState<LanguageMode>(getStoredLanguage);
  const [auth, setAuth] = useState<AuthDraft>({ username: getStoredUsername(), password: '' });
  const [authError, setAuthError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const copy = signupCopy[language];
  const signupReady = auth.username.trim().length >= 3 && auth.password.length >= 6;
  const progress = useMemo(() => {
    if (screen === 'signup') return 12;
    if (screen === 'step1') return 48;
    if (screen === 'step2') return 82;
    if (screen === 'analyzing') return Math.min(100, 82 + (analysisTotal ? ((analysisTotal - analysisRemaining) / analysisTotal) * 18 : 0));
    return 100;
  }, [analysisRemaining, analysisTotal, screen]);

  useEffect(() => {
    window.localStorage.setItem('marketpilot-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('marketpilot-language', language);
  }, [language]);

  useEffect(() => {
    if (screen !== 'analyzing' || analysisReady) return undefined;
    const timer = window.setInterval(() => {
      setAnalysisRemaining((current) => {
        const next = Math.max(0, current - 1);
        setAnalysisStage(getStage(analysisTotal ? (analysisTotal - next) / analysisTotal : 1));
        if (next === 0) setAnalysisReady(true);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [analysisReady, analysisTotal, screen]);

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  }

  function startAnalysis() {
    const seconds = estimateSeconds(business, setup);
    setAnalysisStage(1);
    setAnalysisRemaining(seconds);
    setAnalysisTotal(seconds);
    setAnalysisReady(false);
    setScreen('analyzing');
  }

  function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signupReady) {
      setAuthError(copy.error);
      return;
    }
    const workspace = {
      username: auth.username.trim(),
      createdAt: new Date().toISOString(),
      workspaceId: `mp-${Date.now()}`,
      passwordSet: true,
    };
    window.localStorage.setItem('marketpilot-user', JSON.stringify(workspace));
    setAuthError('');
    setScreen('step1');
  }

  const product = business.products[0];

  return <div className={`app-shell theme-${theme}`}><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="ambient ambient-one" /><div className="ambient ambient-two" />
    {screen === 'signup' ? <main className="signup-page"><div className="signup-topline"><BrandMark /><div className="utility-bar"><button className="utility-btn" type="button" onClick={() => setLanguage(language === 'en' ? 'my' : 'en')} aria-label="Switch language">{copy.language}</button><button className="utility-btn" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle dark mode">{theme === 'light' ? copy.themeDark : copy.themeLight}</button></div></div><section className="signup-layout"><div className="hero-copy"><span className="eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p><div className="service-stack" aria-label={copy.overviewLabel}>{copy.services.map((service) => <article className="service-card" key={service.title}><span>{service.badge}</span><div><b>{service.title}</b><p>{service.body}</p></div></article>)}</div></div><section className="auth-card glass"><div className="card-head center"><span className="mini-orbit">•</span><h2>{copy.authTitle}</h2><p>{copy.authBody}</p></div><form className="auth-form" onSubmit={handleSignup}><label className="field"><span className="field-label">{copy.username}</span><input value={auth.username} onChange={(event) => setAuth({ ...auth, username: event.target.value })} placeholder={copy.usernamePlaceholder} autoComplete="username" /></label><label className="field"><span className="field-label">{copy.password}</span><div className="password-wrap"><input value={auth.password} onChange={(event) => setAuth({ ...auth, password: event.target.value })} placeholder={copy.passwordPlaceholder} type={passwordVisible ? 'text' : 'password'} autoComplete="new-password" /><button type="button" onClick={() => setPasswordVisible((current) => !current)}>{passwordVisible ? copy.hide : copy.show}</button></div></label>{authError ? <p className="auth-error">{authError}</p> : <p className="auth-security">{copy.saved}</p>}<button className="primary-btn full" type="submit" disabled={!signupReady}>{copy.submit}</button></form></section></section></main> : null}
    {screen === 'step1' ? <main className="page-container"><Header step="Step 1 of 2" title="Business DNA Setup" subtitle="Business Identity and Product Data" /><section className="panel glass with-line"><div className="section-head"><div><h2>Business Identity</h2><p>Tell MarketPilot what your business is.</p></div><span className="pill-soft">Core DNA</span></div><div className="grid-two"><label className="field"><span className="field-label">Business Name</span><input value={business.businessName} onChange={(event) => setBusiness({ ...business, businessName: event.target.value })} /></label><div className="field"><span className="field-label">Industry Category</span><div className="chip-row">{categories.map((item) => <Chip key={item} label={item} active={business.category === item} onClick={() => setBusiness({ ...business, category: item })} />)}</div></div></div><label className="field"><span className="field-label">Business Description</span><textarea value={business.description} onChange={(event) => setBusiness({ ...business, description: event.target.value })} /></label></section><section className="panel glass with-line secondary-line"><div className="section-head"><div><h2>Product Universe</h2><p>Add the product that the AI should analyze.</p></div><span className="pill-soft">1 item</span></div><div className="grid-two"><label className="field"><span className="field-label">Product Name</span><input value={product.name} onChange={(event) => setBusiness({ ...business, products: [{ ...product, name: event.target.value }] })} /></label><label className="field"><span className="field-label">Price</span><input value={product.price} onChange={(event) => setBusiness({ ...business, products: [{ ...product, price: event.target.value }] })} /></label><label className="field"><span className="field-label">Category</span><input value={product.category} onChange={(event) => setBusiness({ ...business, products: [{ ...product, category: event.target.value }] })} /></label><label className="field"><span className="field-label">Unique Selling Point</span><input value={product.usp} onChange={(event) => setBusiness({ ...business, products: [{ ...product, usp: event.target.value }] })} /></label></div></section><BottomNav backLabel="Back" nextLabel="Next" onBack={() => setScreen('signup')} onNext={() => setScreen('step2')} /></main> : null}
    {screen === 'step2' ? <main className="page-container step-two"><Header step="Step 2 of 2" title="Business DNA Setup" subtitle="Channels and Goals" /><section className="panel glass platform-panel"><div className="section-head"><div><h2>Platform Integrations</h2><p>Select the channels your business uses.</p></div></div><div className="platform-grid">{platforms.map((platform) => <button key={platform} className={`platform-card ${setup.connectedPlatforms.includes(platform) ? 'connected' : ''}`} type="button" onClick={() => setSetup({ ...setup, connectedPlatforms: toggle(setup.connectedPlatforms, platform) })}><span className="platform-icon">{platform.slice(0, 1)}</span><span><b>{platform}</b><small>{setup.connectedPlatforms.includes(platform) ? 'Connected' : 'Connect account'}</small></span><em>{setup.connectedPlatforms.includes(platform) ? 'on' : 'Connect'}</em></button>)}</div></section><section className="panel glass"><div className="section-head"><div><h2>Posting Habits and Goals</h2><p>Help us tailor your AI content calendar pacing.</p></div></div><div className="preference-block"><strong>Posting frequency</strong><div className="chip-row">{frequencies.map((item) => <Chip key={item} label={item} active={setup.postingFrequency === item} onClick={() => setSetup({ ...setup, postingFrequency: item })} />)}</div></div><div className="preference-block"><strong>Primary AI assistance needed</strong><div className="chip-row">{assistanceOptions.map((item) => <Chip key={item} label={item} active={setup.assistance.includes(item)} onClick={() => setSetup({ ...setup, assistance: toggle(setup.assistance, item) })} />)}</div></div></section><section className="ready-note"><span>*</span><p><b>Almost Ready</b><br />Press Complete Setup to send your Business DNA into the AI analysis animation.</p></section><BottomNav backLabel="Back to Step 1" nextLabel="Complete Setup" onBack={() => setScreen('step1')} onNext={startAnalysis} /></main> : null}
    {screen === 'analyzing' ? <AnalysisLoadingPage stage={analysisStage} remaining={analysisRemaining} ready={analysisReady} saving={false} business={business} setup={setup} onOpen={() => setScreen('dashboardOpening')} /> : null}
    {screen === 'dashboardOpening' || screen === 'dashboard' ? <DashboardExperience business={business} setup={setup} opening={screen === 'dashboardOpening'} onOpened={() => setScreen('dashboard')} onEdit={() => setScreen('step1')} /> : null}
  </div>;
}

function Header({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return <header className="page-header"><BrandMark /><span className="eyebrow">{step} - {subtitle}</span><h1>{title}</h1><p>Premium, calm, human-made UI for Myanmar online business owners.</p></header>;
}

function BottomNav({ backLabel, nextLabel, onBack, onNext }: { backLabel: string; nextLabel: string; onBack: () => void; onNext: () => void }) {
  return <nav className="bottom-nav"><button className="ghost-btn" type="button" onClick={onBack}>{backLabel}</button><button className="primary-btn" type="button" onClick={onNext}>{nextLabel}</button></nav>;
}
