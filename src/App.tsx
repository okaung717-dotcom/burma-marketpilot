import { FormEvent, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase, toSyntheticEmail, uploadPublicFile } from './lib/supabase';
import type { BusinessDraft, ProductDraft, Screen, SetupDraft } from './types';

const categories = ['Fashion', 'F&B', 'Beauty & Cosmetics', 'Tech Services', 'Retail'];
const voices = ['Friendly', 'Premium', 'Playful', 'Authoritative', 'Minimalist', 'Traditional'];
const frequencies = ['Daily', '2-3 Times a Week', 'Weekly', 'Occasionally'];
const assistanceOptions = ['Content Calendar', 'Captions & Copy', 'Image Generation', 'Audience Engagement'];

const platforms = [
  { name: 'Facebook Page', icon: 'f', note: 'Page insights + comment ideas' },
  { name: 'Instagram', icon: '◎', note: 'Reels, story, visual grid' },
  { name: 'TikTok', icon: '♪', note: 'Short video content rhythm' },
  { name: 'Messenger', icon: '✉', note: 'DM reply templates' },
  { name: 'Viber', icon: '☎', note: 'Myanmar customer chat' },
  { name: 'Telegram', icon: '➤', note: 'Channel broadcast plan' },
  { name: 'Website', icon: '⌘', note: 'Traffic + landing page ideas' },
  { name: 'Google Business', icon: '⌂', note: 'Local discovery signals' }
];

const createProduct = (): ProductDraft => ({
  id: crypto.randomUUID(),
  name: 'Premium Arabica Blend',
  category: 'Coffee Beans',
  price: '25,000',
  usp: 'Locally sourced from Shan State',
  images: []
});

const initialBusiness: BusinessDraft = {
  businessName: 'Royal Rangoon Coffee',
  category: 'F&B',
  description: 'A premium Myanmar coffee brand serving authentic local beans for modern café lovers.',
  brandVoice: ['Premium'],
  products: [createProduct()]
};

const initialSetup: SetupDraft = {
  connectedPlatforms: ['Facebook Page'],
  postingFrequency: '2-3 Times a Week',
  assistance: ['Captions & Copy', 'Audience Engagement']
};

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={`chip ${active ? 'chip-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="Burma MarketPilot logo">
      <span className="brand-icon">◐</span>
      <span>Burma MarketPilot</span>
      <i />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('signup');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ownerId, setOwnerId] = useState<string>(() => crypto.randomUUID());
  const [business, setBusiness] = useState<BusinessDraft>(initialBusiness);
  const [setup, setSetup] = useState<SetupDraft>(initialSetup);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const progress = useMemo(() => {
    if (screen === 'signup') return 12;
    if (screen === 'step1') return 48;
    if (screen === 'step2') return 82;
    return 100;
  }, [screen]);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast('');

    if (!accountName.trim() || password.length < 6) {
      setToast('Account name ဖြည့်ပြီး password ကို အနည်းဆုံး 6 လုံးထားပါ။');
      return;
    }

    try {
      setLoading(true);
      if (supabase) {
        const email = toSyntheticEmail(accountName);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              account_name: accountName.trim(),
              app: 'Burma MarketPilot'
            }
          }
        });
        if (error) throw error;
        setOwnerId(data.user?.id || ownerId);
      }
      setScreen('step1');
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Sign up မအောင်မြင်သေးပါ။ Supabase setting စစ်ပါ။');
    } finally {
      setLoading(false);
    }
  }

  function toggleVoice(voice: string) {
    setBusiness((current) => ({
      ...current,
      brandVoice: current.brandVoice.includes(voice)
        ? current.brandVoice.filter((item) => item !== voice)
        : [...current.brandVoice, voice]
    }));
  }

  function togglePlatform(platform: string) {
    setSetup((current) => ({
      ...current,
      connectedPlatforms: current.connectedPlatforms.includes(platform)
        ? current.connectedPlatforms.filter((item) => item !== platform)
        : [...current.connectedPlatforms, platform]
    }));
  }

  function toggleAssistance(item: string) {
    setSetup((current) => ({
      ...current,
      assistance: current.assistance.includes(item)
        ? current.assistance.filter((value) => value !== item)
        : [...current.assistance, item]
    }));
  }

  function updateProduct(productId: string, patch: Partial<ProductDraft>) {
    setBusiness((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === productId ? { ...product, ...patch } : product))
    }));
  }

  function addProduct() {
    setBusiness((current) => ({ ...current, products: [...current.products, createProduct()] }));
  }

  function removeProduct(productId: string) {
    setBusiness((current) => ({
      ...current,
      products: current.products.length === 1 ? current.products : current.products.filter((product) => product.id !== productId)
    }));
  }

  function handleLogoChange(file?: File) {
    if (!file) return;
    setBusiness((current) => ({ ...current, logo: file, logoPreviewUrl: URL.createObjectURL(file) }));
  }

  function handleProductImage(productId: string, file?: File) {
    if (!file) return;
    setBusiness((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== productId || product.images.length >= 4) return product;
        return {
          ...product,
          images: [...product.images, { file, previewUrl: URL.createObjectURL(file) }]
        };
      })
    }));
  }

  async function persistSetup() {
    setToast('');
    try {
      setLoading(true);
      let logoPublicUrl = business.logoPublicUrl;
      let logoStoragePath = business.logoStoragePath;

      if (supabase && business.logo) {
        const uploaded = await uploadPublicFile('business-logos', business.logo, ownerId, 'logos');
        logoPublicUrl = uploaded.publicUrl;
        logoStoragePath = uploaded.path;
      }

      if (supabase) {
        const { data: businessRow, error: businessError } = await supabase
          .from('businesses')
          .insert({
            owner_id: ownerId,
            logo_url: logoPublicUrl,
            logo_storage_path: logoStoragePath,
            business_name: business.businessName,
            industry_category: business.category,
            description: business.description,
            brand_voice: business.brandVoice
          })
          .select('id')
          .single();

        if (businessError) throw businessError;

        for (const product of business.products) {
          const { data: productRow, error: productError } = await supabase
            .from('products')
            .insert({
              business_id: businessRow.id,
              owner_id: ownerId,
              product_name: product.name,
              category: product.category,
              price_mmk: Number(product.price.replace(/,/g, '')) || null,
              unique_selling_point: product.usp
            })
            .select('id')
            .single();

          if (productError) throw productError;

          for (const [index, image] of product.images.entries()) {
            if (!image.file) continue;
            const uploaded = await uploadPublicFile('product-images', image.file, ownerId, `products/${productRow.id}`);
            const { error: imageError } = await supabase.from('product_images').insert({
              product_id: productRow.id,
              owner_id: ownerId,
              image_url: uploaded.publicUrl,
              storage_path: uploaded.path,
              sort_order: index
            });
            if (imageError) throw imageError;
          }
        }

        const integrationRows = platforms.map((platform) => ({
          owner_id: ownerId,
          platform: platform.name,
          status: setup.connectedPlatforms.includes(platform.name) ? 'connected' : 'not_connected',
          account_handle: null
        }));
        const { error: integrationError } = await supabase.from('social_integrations').insert(integrationRows);
        if (integrationError) throw integrationError;

        const { error: preferenceError } = await supabase.from('marketing_preferences').insert({
          owner_id: ownerId,
          posting_frequency: setup.postingFrequency,
          assistance: setup.assistance
        });
        if (preferenceError) throw preferenceError;
      }

      setScreen('ready');
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Setup save မအောင်မြင်သေးပါ။');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {toast ? <div className="toast">{toast}</div> : null}

      {screen === 'signup' ? (
        <main className="signup-page">
          <BrandMark />
          <section className="signup-layout">
            <div className="hero-copy">
              <span className="eyebrow">Myanmar business AI command center</span>
              <h1>Marketing direction ကို Business DNA ကနေ စတင်ဖန်တီးပါ။</h1>
              <p>
                Products, logo, price, audience, social channels တွေကို တစ်ခါတည်း သိမ်းပြီး content calendar, captions, campaign ideas တွေထုတ်နိုင်မယ့် premium starter website.
              </p>
              <div className="metric-row">
                <div><b>2-Step</b><span>Onboarding</span></div>
                <div><b>4-Color</b><span>Premium system</span></div>
                <div><b>Supabase</b><span>Auth + Storage</span></div>
              </div>
            </div>

            <form className="auth-card glass" onSubmit={handleSignup}>
              <div className="card-head center">
                <span className="mini-orbit">◦</span>
                <h2>Start Your MarketPilot Journey</h2>
                <p>Business DNA ကို အရင်တည်ဆောက်ပြီး products အတွက် smarter marketing direction ထုတ်ပါ။</p>
              </div>

              <Field label="Account Name" hint="Business owner name or brand account name.">
                <input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Enter account name" />
              </Field>

              <Field label="Password">
                <div className="password-wrap">
                  <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" type={showPassword ? 'text' : 'password'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </Field>

              <button className="primary-btn full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
              <p className="auth-note">Already have an account? <button type="button" onClick={() => setScreen('step1')}>Sign in</button></p>
              {!isSupabaseConfigured ? <p className="dev-note">Dev mode: .env.local မထည့်သေးလည်း UI flow ကို စမ်းလို့ရအောင် mock mode ဖွင့်ထားပါတယ်။</p> : null}
            </form>
          </section>
        </main>
      ) : null}

      {screen === 'step1' ? (
        <main className="page-container">
          <Header step="Step 1 of 2" title="Business DNA Setup" subtitle="Business Identity & Product Data" />

          <section className="panel glass with-line">
            <div className="section-head">
              <div>
                <h2>Business Identity</h2>
                <p>Upload your logo and define how your business presents itself.</p>
              </div>
              <span className="pill-soft">Core DNA</span>
            </div>

            <Field label="Brand Logo">
              <label className="upload-zone">
                {business.logoPreviewUrl ? <img src={business.logoPreviewUrl} alt="Business logo preview" /> : <span>＋</span>}
                <strong>{business.logoPreviewUrl ? 'Logo Ready' : 'Upload High-Res Logo'}</strong>
                <small>PNG, JPG up to 5MB</small>
                <input type="file" accept="image/*" onChange={(event) => handleLogoChange(event.target.files?.[0])} />
              </label>
            </Field>

            <div className="grid-two">
              <Field label="Business Name">
                <input value={business.businessName} onChange={(event) => setBusiness({ ...business, businessName: event.target.value })} placeholder="e.g. Royal Rangoon Coffee" />
              </Field>
              <Field label="Industry Category">
                <div className="chip-row">
                  {categories.map((item) => (
                    <Chip key={item} active={business.category === item} onClick={() => setBusiness({ ...business, category: item })}>{item}</Chip>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Business Description">
              <textarea value={business.description} onChange={(event) => setBusiness({ ...business, description: event.target.value })} placeholder="Mission, target audience, what makes your brand unique..." />
            </Field>
          </section>

          <section className="panel glass with-line secondary-line">
            <div className="section-head">
              <div>
                <h2>Product Universe</h2>
                <p>Add flagship products or services to feed the AI campaign generator.</p>
              </div>
              <span className="pill-soft">{business.products.length} item added</span>
            </div>

            <div className="product-stack">
              {business.products.map((product, productIndex) => (
                <article className="product-card" key={product.id}>
                  <button className="icon-btn danger" type="button" onClick={() => removeProduct(product.id)} aria-label="Remove product">×</button>
                  <div className="product-number">Product {productIndex + 1}</div>
                  <div className="grid-two">
                    <Field label="Product Name"><input value={product.name} onChange={(event) => updateProduct(product.id, { name: event.target.value })} /></Field>
                    <Field label="Category"><input value={product.category} onChange={(event) => updateProduct(product.id, { category: event.target.value })} /></Field>
                    <Field label="Price (MMK)"><input value={product.price} onChange={(event) => updateProduct(product.id, { price: event.target.value })} /></Field>
                    <Field label="Unique Selling Point"><input value={product.usp} onChange={(event) => updateProduct(product.id, { usp: event.target.value })} /></Field>
                  </div>
                  <div className="image-grid">
                    {Array.from({ length: 4 }).map((_, index) => {
                      const image = product.images[index];
                      return (
                        <label className="image-slot" key={index}>
                          {image ? <img src={image.previewUrl} alt={`Product ${index + 1}`} /> : <span>＋</span>}
                          <input type="file" accept="image/*" onChange={(event) => handleProductImage(product.id, event.target.files?.[0])} />
                        </label>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>

            <button className="ghost-btn full" type="button" onClick={addProduct}>＋ Add Another Product</button>
          </section>

          <section className="panel glass compact">
            <div className="section-head">
              <div>
                <h2>Brand Voice <small>Optional</small></h2>
                <p>Select tones that represent how you speak to customers.</p>
              </div>
            </div>
            <div className="chip-row">
              {voices.map((voice) => <Chip key={voice} active={business.brandVoice.includes(voice)} onClick={() => toggleVoice(voice)}>{voice}</Chip>)}
            </div>
          </section>

          <BottomNav backLabel="Back" nextLabel="Next" onBack={() => setScreen('signup')} onNext={() => setScreen('step2')} />
        </main>
      ) : null}

      {screen === 'step2' ? (
        <main className="page-container step-two">
          <Header step="Step 2 of 2" title="Business DNA Setup" subtitle="Connect Your Social Channels" />

          <section className="panel glass platform-panel">
            <div className="section-head">
              <div>
                <h2>Platform Integrations</h2>
                <p>Connect where your audience lives to enable seamless posting and AI insights.</p>
              </div>
            </div>
            <div className="platform-grid">
              {platforms.map((platform) => {
                const active = setup.connectedPlatforms.includes(platform.name);
                return (
                  <button key={platform.name} className={`platform-card ${active ? 'connected' : ''}`} type="button" onClick={() => togglePlatform(platform.name)}>
                    <span className="platform-icon">{platform.icon}</span>
                    <span><b>{platform.name}</b><small>{active ? 'Connected' : platform.note}</small></span>
                    <em>{active ? '●' : 'Connect'}</em>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel glass">
            <div className="section-head">
              <div>
                <h2>Posting Habits & Goals</h2>
                <p>Help us tailor your AI content calendar pacing.</p>
              </div>
            </div>
            <div className="preference-block">
              <strong>How often do you plan to post?</strong>
              <div className="chip-row">
                {frequencies.map((frequency) => <Chip key={frequency} active={setup.postingFrequency === frequency} onClick={() => setSetup({ ...setup, postingFrequency: frequency })}>{frequency}</Chip>)}
              </div>
            </div>
            <div className="preference-block">
              <strong>Primary AI assistance needed</strong>
              <div className="chip-row">
                {assistanceOptions.map((item) => <Chip key={item} active={setup.assistance.includes(item)} onClick={() => toggleAssistance(item)}>{item}</Chip>)}
              </div>
            </div>
          </section>

          <section className="ready-note">
            <span>💡</span>
            <p><b>Almost Ready</b><br />MarketPilot AI က past performance, brand voice, Myanmar audience behavior တွေကို reference လုပ်ပြီး content calendar နဲ့ campaign direction ထုတ်ပေးနိုင်ဖို့ data ပြင်ဆင်ထားပါမယ်။</p>
          </section>

          <BottomNav backLabel="Back to Step 1" nextLabel={loading ? 'Saving...' : 'Complete Setup'} onBack={() => setScreen('step1')} onNext={persistSetup} />
        </main>
      ) : null}

      {screen === 'ready' ? (
        <main className="ready-page">
          <BrandMark />
          <section className="ready-card glass">
            <span className="success-mark">✓</span>
            <h1>MarketPilot Workspace Ready</h1>
            <p>
              Business DNA သိမ်းပြီးပါပြီ။ နောက်အဆင့်မှာ AI Content Calendar, Captions, Campaign Ideas, PDF/Google Sheet Export, Burma Ai Studio visual creation recommendation တွေထည့်နိုင်ပါတယ်။
            </p>
            <div className="next-grid">
              <div><b>01</b><span>Generate 30-day content calendar</span></div>
              <div><b>02</b><span>Create Facebook/TikTok captions</span></div>
              <div><b>03</b><span>Export PDF + Google Sheet</span></div>
            </div>
            <button className="primary-btn" onClick={() => setScreen('step1')}>Edit Business DNA</button>
          </section>
        </main>
      ) : null}
    </div>
  );
}

function Header({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <header className="page-header">
      <BrandMark />
      <span className="eyebrow">{step} · {subtitle}</span>
      <h1>{title}</h1>
      <p>Premium, calm, human-made UI for Myanmar online business owners.</p>
    </header>
  );
}

function BottomNav({ backLabel, nextLabel, onBack, onNext }: { backLabel: string; nextLabel: string; onBack: () => void; onNext: () => void }) {
  return (
    <nav className="bottom-nav">
      <button className="ghost-btn" type="button" onClick={onBack}>← {backLabel}</button>
      <button className="primary-btn" type="button" onClick={onNext}>{nextLabel} →</button>
    </nav>
  );
}
