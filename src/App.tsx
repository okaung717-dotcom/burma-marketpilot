import { useEffect, useMemo, useState, type FormEvent } from 'react';
import AnalysisLoadingPage from './AnalysisLoading';
import DashboardExperience from './DashboardExperience';
import type { BusinessDraft, ProductDraft, SetupDraft } from './types';
import './SignupEnhancements.css';

const categories = ['Fashion', 'F&B', 'Beauty', 'Tech Services', 'Retail', 'Education', 'Health', 'Home Living'];
const frequencies = ['Daily', '2-3 Times a Week', 'Weekly', 'Occasionally'];
const assistanceOptions = ['Content Calendar', 'Captions & Copy', 'Image Generation', 'Audience Engagement'];
const platforms = ['Facebook Page', 'Instagram', 'TikTok', 'Messenger', 'Viber', 'Telegram', 'Website', 'Google Business'];
const brandVoices = ['Premium', 'Friendly', 'Trustworthy', 'Bold', 'Warm Myanmar', 'Fast Service'];
const productSlots = [0, 1, 2];

const createProduct = (index = 1): ProductDraft => ({
  id: crypto.randomUUID(),
  name: index === 1 ? 'Premium Arabica Blend' : `New Product ${index}`,
  category: index === 1 ? 'Coffee Beans' : 'Product Category',
  price: index === 1 ? '25000' : '',
  usp: index === 1 ? 'Locally sourced from Shan State' : '',
  description: index === 1 ? 'Medium roast beans for office, home and cafe customers who want authentic Myanmar coffee taste.' : '',
  stock: index === 1 ? '120 packs available' : '',
  tags: index === 1 ? 'coffee, Shan State, premium, gift set' : '',
  images: []
});

const initialBusiness: BusinessDraft = {
  businessName: 'Royal Rangoon Coffee',
  category: 'F&B',
  description: 'A premium Myanmar coffee brand serving authentic local beans.',
  location: 'Yangon, Myanmar - nationwide delivery',
  targetAudience: 'Office workers, coffee lovers, cafe owners and gift buyers',
  marketingBudget: '300000 MMK / month',
  mainGoal: 'Increase online orders and build a trusted Myanmar coffee brand',
  currentPromotion: 'Buy 2 packs and get free delivery inside Yangon',
  fulfillmentProcess: 'Messenger order > KPay payment > same-day packing > delivery confirmation',
  customerPainPoint: 'Customers want premium taste, clear price, trusted payment and fast delivery.',
  brandVoice: ['Premium', 'Trustworthy', 'Warm Myanmar'],
  products: [createProduct()]
};

const initialSetup: SetupDraft = {
  connectedPlatforms: ['Facebook Page'],
  postingFrequency: '2-3 Times a Week',
  assistance: ['Captions & Copy', 'Audience Engagement']
};

type AppScreen = 'signup' | 'step1' | 'step2' | 'analyzing' | 'dashboardOpening' | 'dashboard';
type ThemeMode = 'light' | 'dark';
type LanguageMode = 'en' | 'my';
type AuthDraft = { email: string; password: string };

const signupCopy = {
  en: {
    eyebrow: 'Myanmar business AI command center',
    title: 'Turn Business DNA into a daily marketing pilot.',
    description: 'Create your account, add your business data once, and let Burma MarketPilot prepare a practical marketing direction for products, platforms, posts and creative decisions.',
    overviewLabel: 'Service overview',
    services: [
      { badge: '01', title: 'AI Content Calendar', body: 'Plans what to post, where to post, and when to publish for every product campaign.' },
      { badge: '02', title: 'Marketing Direction', body: 'Analyzes business category, product value, audience fit and brand voice before giving action steps.' },
      { badge: '03', title: 'Export-ready Strategy', body: 'Prepares a clear roadmap that can become Google Sheet and PDF-ready marketing work.' }
    ],
    authTitle: 'Create your account',
    authBody: 'Use a real email address and password to open a MarketPilot workspace on this device.',
    email: 'Email address',
    emailPlaceholder: 'e.g. owner@royalrangoon.com',
    emailHelp: 'A valid email format is required before setup can start.',
    emailCreate: 'Create email account',
    password: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',
    show: 'Show',
    hide: 'Hide',
    submit: 'Sign Up & Start Setup',
    saved: 'Your email-based workspace preferences will be remembered on this browser.',
    error: 'Please enter a valid email address and a password with at least 6 characters.',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    language: 'မြန်မာ'
  },
  my: {
    eyebrow: 'မြန်မာစီးပွားရေး AI Command Center',
    title: 'Business DNA ကနေ နေ့စဉ် Marketing လမ်းညွှန်ကို ဖန်တီးပါ။',
    description: 'Account တစ်ခုဖန်တီးပြီး Business Data ကိုတစ်ကြိမ်ဖြည့်လိုက်တာနဲ့ Burma MarketPilot က Product, Platform, Post နဲ့ Creative Direction အတွက် လက်တွေ့အသုံးဝင်တဲ့ Marketing လမ်းကြောင်းကို ပြင်ဆင်ပေးပါမယ်။',
    overviewLabel: 'Website Service & Overview',
    services: [
      { badge: '01', title: 'AI Content Calendar', body: 'ဘယ်နေ့မှာ ဘာတင်မလဲ၊ ဘယ် Platform မှာ ဘာလုပ်မလဲဆိုတာ Product Campaign အလိုက်စီစဉ်ပေးမယ်။' },
      { badge: '02', title: 'Marketing Direction', body: 'Business Category, Product Value, Customer Audience နဲ့ Brand Voice ကိုစစ်ဆေးပြီး Action Step ပေးမယ်။' },
      { badge: '03', title: 'Export-ready Strategy', body: 'Google Sheet နဲ့ PDF ထုတ်နိုင်တဲ့ Marketing Roadmap ပုံစံအထိ သေချာရှင်းလင်းစီမံပေးမယ်။' }
    ],
    authTitle: 'Account ဖန်တီးပါ',
    authBody: 'Email အစစ်နဲ့ Password ထည့်ပြီး ဒီ Browser ပေါ်မှာ MarketPilot Workspace ကို စတင်အသုံးပြုပါ။',
    email: 'Email',
    emailPlaceholder: 'ဥပမာ - owner@royalrangoon.com',
    emailHelp: 'Setup စတင်နိုင်ဖို့ အသုံးပြုနိုင်တဲ့ Email format မှန်မှန် ထည့်ပေးပါ။',
    emailCreate: 'Email account ဖန်တီးမယ်',
    password: 'Password',
    passwordPlaceholder: 'အနည်းဆုံး ၆ လုံး',
    show: 'ပြ',
    hide: 'ဖုံး',
    submit: 'Sign Up လုပ်ပြီး Setup စတင်မယ်',
    saved: 'သင့် Email-based Workspace Preference တွေကို ဒီ Browser မှာ မှတ်ထားပေးပါမယ်။',
    error: 'Email မှန်မှန်နဲ့ Password အနည်းဆုံး ၆ လုံး ထည့်ပေးပါ။',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    language: 'English'
  }
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function getStoredEmail() {
  try {
    const stored = window.localStorage.getItem('marketpilot-user');
    if (!stored) return '';
    const parsed = JSON.parse(stored) as { email?: string; username?: string };
    if (parsed.email && isValidEmail(parsed.email)) return parsed.email;
    if (parsed.username && isValidEmail(parsed.username)) return parsed.username;
    return '';
  } catch {
    return '';
  }
}

function estimateSeconds(business: BusinessDraft, setup: SetupDraft) {
  const productImageCount = business.products.reduce((total, item) => total + item.images.length, 0);
  const dataWeight = business.description.length + business.mainGoal.length + business.fulfillmentProcess.length;
  return Math.min(90, Math.max(24, 18 + business.products.length * 5 + productImageCount * 2 + setup.connectedPlatforms.length * 2 + Math.ceil(dataWeight / 120)));
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
  const [auth, setAuth] = useState<AuthDraft>({ email: getStoredEmail(), password: '' });
  const [authError, setAuthError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const copy = signupCopy[language];
  const signupReady = isValidEmail(auth.email) && auth.password.length >= 6;
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

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signupReady) {
      setAuthError(copy.error);
      return;
    }
    const workspace = {
      email: auth.email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      workspaceId: `mp-${Date.now()}`,
      passwordSet: true,
      emailFormatVerified: true
    };
    window.localStorage.setItem('marketpilot-user', JSON.stringify(workspace));
    setAuthError('');
    setScreen('step1');
  }

  function handleLogoUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusiness((current) => ({ ...current, logo: file, logoPreviewUrl: URL.createObjectURL(file) }));
  }

  function updateProduct(productId: string, patch: Partial<ProductDraft>) {
    setBusiness((current) => ({
      ...current,
      products: current.products.map((item) => (item.id === productId ? { ...item, ...patch } : item))
    }));
  }

  function handleProductImageUpload(productId: string, slot: number, files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusiness((current) => ({
      ...current,
      products: current.products.map((item) => {
        if (item.id !== productId) return item;
        const images = [...item.images];
        images[slot] = { file, previewUrl: URL.createObjectURL(file) };
        return { ...item, images };
      })
    }));
  }

  function addProduct() {
    setBusiness((current) => ({ ...current, products: [...current.products, createProduct(current.products.length + 1)] }));
  }

  function removeProduct(productId: string) {
    setBusiness((current) => {
      if (current.products.length === 1) return current;
      return { ...current, products: current.products.filter((item) => item.id !== productId) };
    });
  }

  function handleGlobalBack() {
    if (screen === 'step1') setScreen('signup');
    if (screen === 'step2') setScreen('step1');
    if (screen === 'analyzing') setScreen('step2');
    if (screen === 'dashboardOpening' || screen === 'dashboard') setScreen('step1');
  }

  return <div className={`app-shell theme-${theme}`} lang={language === 'my' ? 'my' : 'en'}>
    <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />

    {screen !== 'signup' ? <div className="app-floating-utilities utility-bar" aria-label="Page controls">
      <button className="utility-btn utility-back-btn" type="button" onClick={handleGlobalBack}>{language === 'my' ? 'နောက်သို့' : 'Back'}</button>
      <button className="utility-btn" type="button" onClick={() => setLanguage(language === 'en' ? 'my' : 'en')} aria-label="Switch language">{copy.language}</button>
      <button className="utility-btn" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle dark mode">{theme === 'light' ? copy.themeDark : copy.themeLight}</button>
    </div> : null}

    {screen === 'signup' ? <main className={`signup-page signup-lang-${language}`} lang={language === 'my' ? 'my' : 'en'}>
      <div className="signup-topline">
        <BrandMark />
        <div className="utility-bar">
          <button className="utility-btn" type="button" onClick={() => setLanguage(language === 'en' ? 'my' : 'en')} aria-label="Switch language">{copy.language}</button>
          <button className="utility-btn" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle dark mode">{theme === 'light' ? copy.themeDark : copy.themeLight}</button>
        </div>
      </div>
      <section className="signup-layout">
        <div className="hero-copy">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="service-stack" aria-label={copy.overviewLabel}>
            {copy.services.map((service) => <article className="service-card" key={service.title}><span>{service.badge}</span><div><b>{service.title}</b><p>{service.body}</p></div></article>)}
          </div>
        </div>
        <section className="auth-card glass">
          <div className="card-head center"><span className="mini-orbit">•</span><h2>{copy.authTitle}</h2><p>{copy.authBody}</p></div>
          <form className="auth-form" onSubmit={handleSignup}>
            <label className="field email-field"><span className="field-label">{copy.email}</span><input value={auth.email} onChange={(event) => { setAuth({ ...auth, email: event.target.value }); if (authError) setAuthError(''); }} placeholder={copy.emailPlaceholder} type="email" inputMode="email" autoComplete="email" required pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" /><small className="email-helper">{copy.emailHelp} <a className="email-create-link" href="https://accounts.google.com/signup" target="_blank" rel="noreferrer">{copy.emailCreate}</a></small></label>
            <label className="field"><span className="field-label">{copy.password}</span><div className="password-wrap"><input value={auth.password} onChange={(event) => { setAuth({ ...auth, password: event.target.value }); if (authError) setAuthError(''); }} placeholder={copy.passwordPlaceholder} type={passwordVisible ? 'text' : 'password'} autoComplete="new-password" /><button type="button" onClick={() => setPasswordVisible((current) => !current)}>{passwordVisible ? copy.hide : copy.show}</button></div></label>
            {authError ? <p className="auth-error">{authError}</p> : <p className="auth-security">{copy.saved}</p>}
            <button className="primary-btn full" type="submit" disabled={!signupReady}>{copy.submit}</button>
          </form>
        </section>
      </section>
    </main> : null}

    {screen === 'step1' ? <main className="page-container business-dna-page">
      <Header step="Step 1 of 2" title="Business DNA Setup" subtitle="Brand Assets, Product Data and Management Intelligence" />
      <section className="dna-overview glass">
        <div>
          <span className="eyebrow compact">Real business workspace</span>
          <h2>Fill everything a professional marketing manager needs before analysis.</h2>
          <p>Logo, business type, products, product pictures, price data, audience, offers, delivery process and management notes are collected in one premium setup page.</p>
        </div>
        <div className="setup-metrics" aria-label="Business setup summary">
          <div><b>{business.products.length}</b><span>Product items</span></div>
          <div><b>{business.brandVoice.length}</b><span>Brand voice tags</span></div>
          <div><b>{business.logoPreviewUrl ? 'Logo' : 'Add'}</b><span>Business asset</span></div>
        </div>
      </section>

      <section className="panel glass with-line dna-command-panel">
        <div className="section-head">
          <div><h2>Business Identity</h2><p>Tell MarketPilot what your business is, who you sell to, and how your brand should sound.</p></div>
          <span className="pill-soft">Core DNA</span>
        </div>
        <div className="identity-layout">
          <aside className="brand-upload-card">
            <label className={`logo-upload-zone ${business.logoPreviewUrl ? 'has-logo' : ''}`}>
              <input type="file" accept="image/*" onChange={(event) => handleLogoUpload(event.target.files)} />
              {business.logoPreviewUrl ? <img src={business.logoPreviewUrl} alt="Business logo preview" /> : <><span>+</span><strong>Upload business logo</strong><small>PNG, JPG or WebP</small></>}
            </label>
            <div className="brand-preview-name">
              <span>{business.businessName.slice(0, 2).toUpperCase()}</span>
              <div><b>{business.businessName || 'Your Business'}</b><small>{business.category} · {business.location}</small></div>
            </div>
          </aside>

          <div className="brand-fields">
            <div className="grid-two">
              <label className="field"><span className="field-label">Business Name</span><input value={business.businessName} onChange={(event) => setBusiness({ ...business, businessName: event.target.value })} /></label>
              <label className="field"><span className="field-label">Location / Service Area</span><input value={business.location} onChange={(event) => setBusiness({ ...business, location: event.target.value })} /></label>
            </div>
            <div className="field"><span className="field-label">Industry Category</span><div className="chip-row premium-chip-row">{categories.map((item) => <Chip key={item} label={item} active={business.category === item} onClick={() => setBusiness({ ...business, category: item })} />)}</div></div>
            <div className="grid-two">
              <label className="field"><span className="field-label">Target Customers</span><input value={business.targetAudience} onChange={(event) => setBusiness({ ...business, targetAudience: event.target.value })} /></label>
              <label className="field"><span className="field-label">Monthly Marketing Budget</span><input value={business.marketingBudget} onChange={(event) => setBusiness({ ...business, marketingBudget: event.target.value })} /></label>
            </div>
            <label className="field"><span className="field-label">Business Description</span><textarea className="textarea-tall" value={business.description} onChange={(event) => setBusiness({ ...business, description: event.target.value })} /></label>
            <div className="field"><span className="field-label">Brand Voice</span><div className="chip-row premium-chip-row">{brandVoices.map((voice) => <Chip key={voice} label={voice} active={business.brandVoice.includes(voice)} onClick={() => setBusiness({ ...business, brandVoice: toggle(business.brandVoice, voice) })} />)}</div></div>
          </div>
        </div>
      </section>

      <section className="panel glass management-panel">
        <div className="section-head">
          <div><h2>Business Management Inputs</h2><p>These fields make the AI output useful like a real professional manager, not only a design form.</p></div>
          <span className="pill-soft">Manager Notes</span>
        </div>
        <div className="management-grid">
          <label className="field"><span className="field-label">Main Business Goal</span><input value={business.mainGoal} onChange={(event) => setBusiness({ ...business, mainGoal: event.target.value })} /></label>
          <label className="field"><span className="field-label">Current Promotion / Offer</span><input value={business.currentPromotion} onChange={(event) => setBusiness({ ...business, currentPromotion: event.target.value })} /></label>
          <label className="field field-wide"><span className="field-label">Order, Payment and Delivery Workflow</span><textarea value={business.fulfillmentProcess} onChange={(event) => setBusiness({ ...business, fulfillmentProcess: event.target.value })} /></label>
          <label className="field field-wide"><span className="field-label">Customer Pain Point / Reason to Buy</span><textarea value={business.customerPainPoint} onChange={(event) => setBusiness({ ...business, customerPainPoint: event.target.value })} /></label>
        </div>
      </section>

      <section className="panel glass with-line secondary-line product-universe-panel">
        <div className="section-head">
          <div><h2>Product Universe</h2><p>Add product names, categories, prices, product data, stock details and real product pictures for AI analysis.</p></div>
          <button className="add-product-btn" type="button" onClick={addProduct}>+ Add Product</button>
        </div>
        <div className="product-stack premium-product-stack">
          {business.products.map((item, index) => <article className="product-card premium-product-card" key={item.id}>
            <div className="product-topline"><span className="product-number">Product {String(index + 1).padStart(2, '0')}</span>{business.products.length > 1 ? <button className="icon-btn danger" type="button" onClick={() => removeProduct(item.id)} aria-label="Remove product">×</button> : null}</div>
            <div className="product-layout">
              <div className="product-image-panel">
                {productSlots.map((slot) => {
                  const image = item.images[slot];
                  return <label className={`image-slot premium-image-slot ${image ? 'has-image' : ''}`} key={`${item.id}-${slot}`}>
                    <input type="file" accept="image/*" onChange={(event) => handleProductImageUpload(item.id, slot, event.target.files)} />
                    {image ? <img src={image.previewUrl} alt={`${item.name} product preview ${slot + 1}`} /> : <><span>+</span><small>Product photo {slot + 1}</small></>}
                  </label>;
                })}
              </div>
              <div className="product-data-fields">
                <div className="grid-two">
                  <label className="field"><span className="field-label">Product Name</span><input value={item.name} onChange={(event) => updateProduct(item.id, { name: event.target.value })} /></label>
                  <label className="field"><span className="field-label">Price</span><input value={item.price} onChange={(event) => updateProduct(item.id, { price: event.target.value })} /></label>
                  <label className="field"><span className="field-label">Product Category</span><input value={item.category} onChange={(event) => updateProduct(item.id, { category: event.target.value })} /></label>
                  <label className="field"><span className="field-label">Stock / Availability</span><input value={item.stock} onChange={(event) => updateProduct(item.id, { stock: event.target.value })} /></label>
                </div>
                <label className="field"><span className="field-label">Unique Selling Point</span><input value={item.usp} onChange={(event) => updateProduct(item.id, { usp: event.target.value })} /></label>
                <label className="field"><span className="field-label">Product Data / Details</span><textarea value={item.description} onChange={(event) => updateProduct(item.id, { description: event.target.value })} /></label>
                <label className="field"><span className="field-label">Tags / Keywords</span><input value={item.tags} onChange={(event) => updateProduct(item.id, { tags: event.target.value })} /></label>
              </div>
            </div>
          </article>)}
        </div>
      </section>

      <BottomNav backLabel="Back" nextLabel="Next" onBack={() => setScreen('signup')} onNext={() => setScreen('step2')} />
    </main> : null}

    {screen === 'step2' ? <main className="page-container step-two">
      <Header step="Step 2 of 2" title="Business DNA Setup" subtitle="Channels and Goals" />
      <section className="panel glass platform-panel">
        <div className="section-head"><div><h2>Platform Integrations</h2><p>Select the channels your business uses.</p></div></div>
        <div className="platform-grid">
          {platforms.map((platform) => <button key={platform} className={`platform-card ${setup.connectedPlatforms.includes(platform) ? 'connected' : ''}`} type="button" onClick={() => setSetup({ ...setup, connectedPlatforms: toggle(setup.connectedPlatforms, platform) })}><span className="platform-icon">{platform.slice(0, 1)}</span><span><b>{platform}</b><small>{setup.connectedPlatforms.includes(platform) ? 'Connected' : 'Connect account'}</small></span><em>{setup.connectedPlatforms.includes(platform) ? 'on' : 'Connect'}</em></button>)}
        </div>
      </section>
      <section className="panel glass">
        <div className="section-head"><div><h2>Posting Habits and Goals</h2><p>Help us tailor your AI content calendar pacing.</p></div></div>
        <div className="preference-block"><strong>Posting frequency</strong><div className="chip-row">{frequencies.map((item) => <Chip key={item} label={item} active={setup.postingFrequency === item} onClick={() => setSetup({ ...setup, postingFrequency: item })} />)}</div></div>
        <div className="preference-block"><strong>Primary AI assistance needed</strong><div className="chip-row">{assistanceOptions.map((item) => <Chip key={item} label={item} active={setup.assistance.includes(item)} onClick={() => setSetup({ ...setup, assistance: toggle(setup.assistance, item) })} />)}</div></div>
      </section>
      <section className="ready-note"><span>*</span><p><b>Almost Ready</b><br />Press Complete Setup to send your Business DNA into the AI analysis animation.</p></section>
      <BottomNav backLabel="Back to Step 1" nextLabel="Complete Setup" onBack={() => setScreen('step1')} onNext={startAnalysis} />
    </main> : null}

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
