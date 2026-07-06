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
type ChoiceLabels = Record<string, string>;
type SetupCopy = {
  headerTagline: string;
  step1: {
    step: string;
    title: string;
    subtitle: string;
    overviewEyebrow: string;
    overviewTitle: string;
    overviewBody: string;
    summaryAria: string;
    productItems: string;
    brandVoiceTags: string;
    businessAsset: string;
    logoMetric: string;
    addMetric: string;
    identityTitle: string;
    identityBody: string;
    identityPill: string;
    logoAlt: string;
    uploadLogo: string;
    uploadFormat: string;
    businessFallback: string;
    businessName: string;
    location: string;
    industry: string;
    targetCustomers: string;
    budget: string;
    description: string;
    brandVoice: string;
    managementTitle: string;
    managementBody: string;
    managementPill: string;
    goal: string;
    offer: string;
    workflow: string;
    painPoint: string;
    productTitle: string;
    productBody: string;
    addProduct: string;
    productPrefix: string;
    removeProduct: string;
    productPhoto: string;
    productName: string;
    price: string;
    productCategory: string;
    stock: string;
    usp: string;
    productDetails: string;
    tags: string;
    back: string;
    next: string;
  };
  step2: {
    step: string;
    title: string;
    subtitle: string;
    platformTitle: string;
    platformBody: string;
    connected: string;
    connectAccount: string;
    on: string;
    connect: string;
    postingTitle: string;
    postingBody: string;
    frequency: string;
    assistance: string;
    readyTitle: string;
    readyBody: string;
    back: string;
    complete: string;
  };
  choices: {
    categories: ChoiceLabels;
    brandVoices: ChoiceLabels;
    frequencies: ChoiceLabels;
    assistance: ChoiceLabels;
    platforms: ChoiceLabels;
  };
};

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

const setupCopy: Record<LanguageMode, SetupCopy> = {
  en: {
    headerTagline: 'Premium, calm, human-made UI for Myanmar online business owners.',
    step1: {
      step: 'Step 1 of 2',
      title: 'Business DNA Setup',
      subtitle: 'Brand Assets, Product Data and Management Intelligence',
      overviewEyebrow: 'Real business workspace',
      overviewTitle: 'Fill everything a professional marketing manager needs before analysis.',
      overviewBody: 'Logo, business type, products, product pictures, price data, audience, offers, delivery process and management notes are collected in one premium setup page.',
      summaryAria: 'Business setup summary',
      productItems: 'Product items',
      brandVoiceTags: 'Brand voice tags',
      businessAsset: 'Business asset',
      logoMetric: 'Logo',
      addMetric: 'Add',
      identityTitle: 'Business Identity',
      identityBody: 'Tell MarketPilot what your business is, who you sell to, and how your brand should sound.',
      identityPill: 'Core DNA',
      logoAlt: 'Business logo preview',
      uploadLogo: 'Upload business logo',
      uploadFormat: 'PNG, JPG or WebP',
      businessFallback: 'Your Business',
      businessName: 'Business Name',
      location: 'Location / Service Area',
      industry: 'Industry Category',
      targetCustomers: 'Target Customers',
      budget: 'Monthly Marketing Budget',
      description: 'Business Description',
      brandVoice: 'Brand Voice',
      managementTitle: 'Business Management Inputs',
      managementBody: 'These fields make the AI output useful like a real professional manager, not only a design form.',
      managementPill: 'Manager Notes',
      goal: 'Main Business Goal',
      offer: 'Current Promotion / Offer',
      workflow: 'Order, Payment and Delivery Workflow',
      painPoint: 'Customer Pain Point / Reason to Buy',
      productTitle: 'Product Universe',
      productBody: 'Add product names, categories, prices, product data, stock details and real product pictures for AI analysis.',
      addProduct: '+ Add Product',
      productPrefix: 'Product',
      removeProduct: 'Remove product',
      productPhoto: 'Product photo',
      productName: 'Product Name',
      price: 'Price',
      productCategory: 'Product Category',
      stock: 'Stock / Availability',
      usp: 'Unique Selling Point',
      productDetails: 'Product Data / Details',
      tags: 'Tags / Keywords',
      back: 'Back',
      next: 'Next'
    },
    step2: {
      step: 'Step 2 of 2',
      title: 'Business DNA Setup',
      subtitle: 'Channels and Goals',
      platformTitle: 'Platform Integrations',
      platformBody: 'Select the channels your business uses.',
      connected: 'Connected',
      connectAccount: 'Connect account',
      on: 'on',
      connect: 'Connect',
      postingTitle: 'Posting Habits and Goals',
      postingBody: 'Help us tailor your AI content calendar pacing.',
      frequency: 'Posting frequency',
      assistance: 'Primary AI assistance needed',
      readyTitle: 'Almost Ready',
      readyBody: 'Press Complete Setup to send your Business DNA into the AI analysis animation.',
      back: 'Back to Step 1',
      complete: 'Complete Setup'
    },
    choices: {
      categories: {},
      brandVoices: {},
      frequencies: {},
      assistance: {},
      platforms: {}
    }
  },
  my: {
    headerTagline: 'မြန်မာ Online Business Owner များအတွက် Premium၊ Calm၊ Human-made UI။',
    step1: {
      step: 'အဆင့် ၁ / ၂',
      title: 'Business DNA Setup',
      subtitle: 'Brand Asset၊ Product Data နဲ့ Management Intelligence',
      overviewEyebrow: 'တကယ့် Business Workspace',
      overviewTitle: 'Analysis မလုပ်ခင် Professional Marketing Manager လိုအပ်တဲ့အချက်အလက်အားလုံးကို ဖြည့်ပါ။',
      overviewBody: 'Logo၊ Business အမျိုးအစား၊ Product များ၊ Product ပုံများ၊ စျေးနှုန်း Data၊ Customer Audience၊ Offer၊ Delivery Process နဲ့ Management Note များကို Premium Setup Page တစ်ခုထဲမှာ စုစည်းထားပါတယ်။',
      summaryAria: 'Business setup summary',
      productItems: 'Product Item များ',
      brandVoiceTags: 'Brand Voice Tag များ',
      businessAsset: 'Business Asset',
      logoMetric: 'Logo',
      addMetric: 'ထည့်ရန်',
      identityTitle: 'Business Identity',
      identityBody: 'သင့် Business က ဘာလုပ်ငန်းလဲ၊ ဘယ်သူ့ကိုရောင်းလဲ၊ Brand အသံက ဘယ်လိုဖြစ်သင့်လဲဆိုတာ MarketPilot ကိုပြောပါ။',
      identityPill: 'Core DNA',
      logoAlt: 'Business logo preview',
      uploadLogo: 'Business Logo တင်ရန်',
      uploadFormat: 'PNG, JPG သို့မဟုတ် WebP',
      businessFallback: 'သင့် Business',
      businessName: 'Business Name',
      location: 'Location / Service Area',
      industry: 'Industry Category',
      targetCustomers: 'Target Customer များ',
      budget: 'လစဉ် Marketing Budget',
      description: 'Business Description',
      brandVoice: 'Brand Voice',
      managementTitle: 'Business Management Input များ',
      managementBody: 'ဒီအချက်အလက်တွေက AI Output ကို Design Form သက်သက်မဟုတ်ဘဲ Real Professional Manager တစ်ယောက်လို အသုံးဝင်အောင်လုပ်ပေးပါတယ်။',
      managementPill: 'Manager Note များ',
      goal: 'အဓိက Business Goal',
      offer: 'လက်ရှိ Promotion / Offer',
      workflow: 'Order, Payment နဲ့ Delivery Workflow',
      painPoint: 'Customer Pain Point / ဝယ်သင့်တဲ့အကြောင်းရင်း',
      productTitle: 'Product Universe',
      productBody: 'AI Analysis အတွက် Product Name၊ Category၊ Price၊ Product Data၊ Stock Detail နဲ့ Product ပုံအစစ်များကို ထည့်ပါ။',
      addProduct: '+ Product ထည့်ရန်',
      productPrefix: 'Product',
      removeProduct: 'Product ဖယ်ရန်',
      productPhoto: 'Product ပုံ',
      productName: 'Product Name',
      price: 'Price',
      productCategory: 'Product Category',
      stock: 'Stock / Availability',
      usp: 'Unique Selling Point',
      productDetails: 'Product Data / Details',
      tags: 'Tag / Keyword များ',
      back: 'နောက်သို့',
      next: 'ရှေ့သို့'
    },
    step2: {
      step: 'အဆင့် ၂ / ၂',
      title: 'Business DNA Setup',
      subtitle: 'Channel နဲ့ Goal များ',
      platformTitle: 'Platform Integration များ',
      platformBody: 'သင့် Business အသုံးပြုနေတဲ့ Channel များကို ရွေးချယ်ပါ။',
      connected: 'ချိတ်ပြီး',
      connectAccount: 'Account ချိတ်ရန်',
      on: 'ဖွင့်ထား',
      connect: 'ချိတ်ရန်',
      postingTitle: 'Posting Habit နဲ့ Goal များ',
      postingBody: 'သင့် AI Content Calendar ရဲ့ Pace ကို ကိုက်ညီအောင် ပြင်ဆင်ပေးနိုင်ဖို့ ကူညီပါ။',
      frequency: 'Post တင်မည့်အကြိမ်ရေ',
      assistance: 'အဓိကလိုအပ်တဲ့ AI အကူအညီ',
      readyTitle: 'အဆင်သင့်ဖြစ်တော့မယ်',
      readyBody: 'Complete Setup ကိုနှိပ်ပြီး သင့် Business DNA ကို AI Analysis Animation ထဲသို့ပို့ပါ။',
      back: 'Step 1 သို့ ပြန်သွားရန်',
      complete: 'Setup ပြီးဆုံးရန်'
    },
    choices: {
      categories: {
        Fashion: 'ဖက်ရှင်',
        'F&B': 'အစားအသောက်နှင့် အဖျော်ယမကာ',
        Beauty: 'အလှအပ',
        'Tech Services': 'နည်းပညာဝန်ဆောင်မှု',
        Retail: 'လက်လီရောင်းချမှု',
        Education: 'ပညာရေး',
        Health: 'ကျန်းမာရေး',
        'Home Living': 'အိမ်သုံး / လူနေမှု'
      },
      brandVoices: {
        Premium: 'Premium',
        Friendly: 'ဖော်ရွေ',
        Trustworthy: 'ယုံကြည်စိတ်ချရ',
        Bold: 'ရဲရင့်',
        'Warm Myanmar': 'နွေးထွေးသော မြန်မာ Tone',
        'Fast Service': 'မြန်ဆန်သော ဝန်ဆောင်မှု'
      },
      frequencies: {
        Daily: 'နေ့စဉ်',
        '2-3 Times a Week': 'တစ်ပတ် ၂-၃ ကြိမ်',
        Weekly: 'တစ်ပတ်တစ်ကြိမ်',
        Occasionally: 'လိုအပ်သလို'
      },
      assistance: {
        'Content Calendar': 'Content Calendar',
        'Captions & Copy': 'Caption နဲ့ Copywriting',
        'Image Generation': 'Image Generation',
        'Audience Engagement': 'Audience Engagement'
      },
      platforms: {
        'Facebook Page': 'Facebook Page',
        Instagram: 'Instagram',
        TikTok: 'TikTok',
        Messenger: 'Messenger',
        Viber: 'Viber',
        Telegram: 'Telegram',
        Website: 'Website',
        'Google Business': 'Google Business'
      }
    }
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

function getChoiceLabel(labels: ChoiceLabels, value: string) {
  return labels[value] ?? value;
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
  const setupText = setupCopy[language];
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

    {(screen === 'step1' || screen === 'step2') ? <div className="app-floating-utilities utility-bar" aria-label="Page controls">
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
      <Header step={setupText.step1.step} title={setupText.step1.title} subtitle={setupText.step1.subtitle} tagline={setupText.headerTagline} />
      <section className="dna-overview glass">
        <div>
          <span className="eyebrow compact">{setupText.step1.overviewEyebrow}</span>
          <h2>{setupText.step1.overviewTitle}</h2>
          <p>{setupText.step1.overviewBody}</p>
        </div>
        <div className="setup-metrics" aria-label={setupText.step1.summaryAria}>
          <div><b>{business.products.length}</b><span>{setupText.step1.productItems}</span></div>
          <div><b>{business.brandVoice.length}</b><span>{setupText.step1.brandVoiceTags}</span></div>
          <div><b>{business.logoPreviewUrl ? setupText.step1.logoMetric : setupText.step1.addMetric}</b><span>{setupText.step1.businessAsset}</span></div>
        </div>
      </section>

      <section className="panel glass with-line dna-command-panel">
        <div className="section-head">
          <div><h2>{setupText.step1.identityTitle}</h2><p>{setupText.step1.identityBody}</p></div>
          <span className="pill-soft">{setupText.step1.identityPill}</span>
        </div>
        <div className="identity-layout">
          <aside className="brand-upload-card">
            <label className={`logo-upload-zone ${business.logoPreviewUrl ? 'has-logo' : ''}`}>
              <input type="file" accept="image/*" onChange={(event) => handleLogoUpload(event.target.files)} />
              {business.logoPreviewUrl ? <img src={business.logoPreviewUrl} alt={setupText.step1.logoAlt} /> : <><span>+</span><strong>{setupText.step1.uploadLogo}</strong><small>{setupText.step1.uploadFormat}</small></>}
            </label>
            <div className="brand-preview-name">
              <span>{business.businessName.slice(0, 2).toUpperCase()}</span>
              <div><b>{business.businessName || setupText.step1.businessFallback}</b><small>{business.category} · {business.location}</small></div>
            </div>
          </aside>

          <div className="brand-fields">
            <div className="grid-two">
              <label className="field"><span className="field-label">{setupText.step1.businessName}</span><input value={business.businessName} onChange={(event) => setBusiness({ ...business, businessName: event.target.value })} /></label>
              <label className="field"><span className="field-label">{setupText.step1.location}</span><input value={business.location} onChange={(event) => setBusiness({ ...business, location: event.target.value })} /></label>
            </div>
            <div className="field"><span className="field-label">{setupText.step1.industry}</span><div className="chip-row premium-chip-row">{categories.map((item) => <Chip key={item} label={getChoiceLabel(setupText.choices.categories, item)} active={business.category === item} onClick={() => setBusiness({ ...business, category: item })} />)}</div></div>
            <div className="grid-two">
              <label className="field"><span className="field-label">{setupText.step1.targetCustomers}</span><input value={business.targetAudience} onChange={(event) => setBusiness({ ...business, targetAudience: event.target.value })} /></label>
              <label className="field"><span className="field-label">{setupText.step1.budget}</span><input value={business.marketingBudget} onChange={(event) => setBusiness({ ...business, marketingBudget: event.target.value })} /></label>
            </div>
            <label className="field"><span className="field-label">{setupText.step1.description}</span><textarea className="textarea-tall" value={business.description} onChange={(event) => setBusiness({ ...business, description: event.target.value })} /></label>
            <div className="field"><span className="field-label">{setupText.step1.brandVoice}</span><div className="chip-row premium-chip-row">{brandVoices.map((voice) => <Chip key={voice} label={getChoiceLabel(setupText.choices.brandVoices, voice)} active={business.brandVoice.includes(voice)} onClick={() => setBusiness({ ...business, brandVoice: toggle(business.brandVoice, voice) })} />)}</div></div>
          </div>
        </div>
      </section>

      <section className="panel glass management-panel">
        <div className="section-head">
          <div><h2>{setupText.step1.managementTitle}</h2><p>{setupText.step1.managementBody}</p></div>
          <span className="pill-soft">{setupText.step1.managementPill}</span>
        </div>
        <div className="management-grid">
          <label className="field"><span className="field-label">{setupText.step1.goal}</span><input value={business.mainGoal} onChange={(event) => setBusiness({ ...business, mainGoal: event.target.value })} /></label>
          <label className="field"><span className="field-label">{setupText.step1.offer}</span><input value={business.currentPromotion} onChange={(event) => setBusiness({ ...business, currentPromotion: event.target.value })} /></label>
          <label className="field field-wide"><span className="field-label">{setupText.step1.workflow}</span><textarea value={business.fulfillmentProcess} onChange={(event) => setBusiness({ ...business, fulfillmentProcess: event.target.value })} /></label>
          <label className="field field-wide"><span className="field-label">{setupText.step1.painPoint}</span><textarea value={business.customerPainPoint} onChange={(event) => setBusiness({ ...business, customerPainPoint: event.target.value })} /></label>
        </div>
      </section>

      <section className="panel glass with-line secondary-line product-universe-panel">
        <div className="section-head">
          <div><h2>{setupText.step1.productTitle}</h2><p>{setupText.step1.productBody}</p></div>
          <button className="add-product-btn" type="button" onClick={addProduct}>{setupText.step1.addProduct}</button>
        </div>
        <div className="product-stack premium-product-stack">
          {business.products.map((item, index) => <article className="product-card premium-product-card" key={item.id}>
            <div className="product-topline"><span className="product-number">{setupText.step1.productPrefix} {String(index + 1).padStart(2, '0')}</span>{business.products.length > 1 ? <button className="icon-btn danger" type="button" onClick={() => removeProduct(item.id)} aria-label={setupText.step1.removeProduct}>×</button> : null}</div>
            <div className="product-layout">
              <div className="product-image-panel">
                {productSlots.map((slot) => {
                  const image = item.images[slot];
                  return <label className={`image-slot premium-image-slot ${image ? 'has-image' : ''}`} key={`${item.id}-${slot}`}>
                    <input type="file" accept="image/*" onChange={(event) => handleProductImageUpload(item.id, slot, event.target.files)} />
                    {image ? <img src={image.previewUrl} alt={`${item.name} product preview ${slot + 1}`} /> : <><span>+</span><small>{setupText.step1.productPhoto} {slot + 1}</small></>}
                  </label>;
                })}
              </div>
              <div className="product-data-fields">
                <div className="grid-two">
                  <label className="field"><span className="field-label">{setupText.step1.productName}</span><input value={item.name} onChange={(event) => updateProduct(item.id, { name: event.target.value })} /></label>
                  <label className="field"><span className="field-label">{setupText.step1.price}</span><input value={item.price} onChange={(event) => updateProduct(item.id, { price: event.target.value })} /></label>
                  <label className="field"><span className="field-label">{setupText.step1.productCategory}</span><input value={item.category} onChange={(event) => updateProduct(item.id, { category: event.target.value })} /></label>
                  <label className="field"><span className="field-label">{setupText.step1.stock}</span><input value={item.stock} onChange={(event) => updateProduct(item.id, { stock: event.target.value })} /></label>
                </div>
                <label className="field"><span className="field-label">{setupText.step1.usp}</span><input value={item.usp} onChange={(event) => updateProduct(item.id, { usp: event.target.value })} /></label>
                <label className="field"><span className="field-label">{setupText.step1.productDetails}</span><textarea value={item.description} onChange={(event) => updateProduct(item.id, { description: event.target.value })} /></label>
                <label className="field"><span className="field-label">{setupText.step1.tags}</span><input value={item.tags} onChange={(event) => updateProduct(item.id, { tags: event.target.value })} /></label>
              </div>
            </div>
          </article>)}
        </div>
      </section>

      <BottomNav backLabel={setupText.step1.back} nextLabel={setupText.step1.next} onBack={() => setScreen('signup')} onNext={() => setScreen('step2')} />
    </main> : null}

    {screen === 'step2' ? <main className="page-container step-two">
      <Header step={setupText.step2.step} title={setupText.step2.title} subtitle={setupText.step2.subtitle} tagline={setupText.headerTagline} />
      <section className="panel glass platform-panel">
        <div className="section-head"><div><h2>{setupText.step2.platformTitle}</h2><p>{setupText.step2.platformBody}</p></div></div>
        <div className="platform-grid">
          {platforms.map((platform) => <button key={platform} className={`platform-card ${setup.connectedPlatforms.includes(platform) ? 'connected' : ''}`} type="button" onClick={() => setSetup({ ...setup, connectedPlatforms: toggle(setup.connectedPlatforms, platform) })}><span className="platform-icon">{platform.slice(0, 1)}</span><span><b>{getChoiceLabel(setupText.choices.platforms, platform)}</b><small>{setup.connectedPlatforms.includes(platform) ? setupText.step2.connected : setupText.step2.connectAccount}</small></span><em>{setup.connectedPlatforms.includes(platform) ? setupText.step2.on : setupText.step2.connect}</em></button>)}
        </div>
      </section>
      <section className="panel glass">
        <div className="section-head"><div><h2>{setupText.step2.postingTitle}</h2><p>{setupText.step2.postingBody}</p></div></div>
        <div className="preference-block"><strong>{setupText.step2.frequency}</strong><div className="chip-row">{frequencies.map((item) => <Chip key={item} label={getChoiceLabel(setupText.choices.frequencies, item)} active={setup.postingFrequency === item} onClick={() => setSetup({ ...setup, postingFrequency: item })} />)}</div></div>
        <div className="preference-block"><strong>{setupText.step2.assistance}</strong><div className="chip-row">{assistanceOptions.map((item) => <Chip key={item} label={getChoiceLabel(setupText.choices.assistance, item)} active={setup.assistance.includes(item)} onClick={() => setSetup({ ...setup, assistance: toggle(setup.assistance, item) })} />)}</div></div>
      </section>
      <section className="ready-note"><span>*</span><p><b>{setupText.step2.readyTitle}</b><br />{setupText.step2.readyBody}</p></section>
      <BottomNav backLabel={setupText.step2.back} nextLabel={setupText.step2.complete} onBack={() => setScreen('step1')} onNext={startAnalysis} />
    </main> : null}

    {screen === 'analyzing' ? <AnalysisLoadingPage stage={analysisStage} remaining={analysisRemaining} ready={analysisReady} saving={false} business={business} setup={setup} onOpen={() => setScreen('dashboardOpening')} /> : null}
    {screen === 'dashboardOpening' || screen === 'dashboard' ? <DashboardExperience business={business} setup={setup} opening={screen === 'dashboardOpening'} onOpened={() => setScreen('dashboard')} onEdit={() => setScreen('step1')} /> : null}
  </div>;
}

function Header({ step, title, subtitle, tagline }: { step: string; title: string; subtitle: string; tagline: string }) {
  return <header className="page-header"><BrandMark /><span className="eyebrow">{step} - {subtitle}</span><h1>{title}</h1><p>{tagline}</p></header>;
}

function BottomNav({ backLabel, nextLabel, onBack, onNext }: { backLabel: string; nextLabel: string; onBack: () => void; onNext: () => void }) {
  return <nav className="bottom-nav"><button className="ghost-btn" type="button" onClick={onBack}>{backLabel}</button><button className="primary-btn" type="button" onClick={onNext}>{nextLabel}</button></nav>;
}
