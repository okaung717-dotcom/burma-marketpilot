import { useEffect, useMemo, useState } from 'react';
import type { BusinessDraft, SetupDraft } from './types';
import './DashboardExperience.css';

type CalendarRow = {
  date: string;
  platform: string;
  task: string;
  content: string;
  media: string;
  status: string;
};

type DashboardExperienceProps = {
  business: BusinessDraft;
  setup: SetupDraft;
  opening: boolean;
  onOpened: () => void;
  onEdit: () => void;
};

const defaultPlatforms = ['Facebook Page', 'Instagram', 'TikTok', 'Messenger'];

function formatCurrency(value: string) {
  const number = Number(value.replace(/[^0-9.]/g, '')) || 25000;
  return `MMK ${number.toLocaleString('en-US')}`;
}

function safeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'burma-marketpilot';
}

function downloadBlob(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function pdfText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .slice(0, 96);
}

function buildSimplePdf(title: string, rows: CalendarRow[]) {
  const lines = [
    title,
    'AI-generated 30-day content calendar preview',
    'Use Burma Ai Studio for images and videos when media is required.',
    '',
    ...rows.map((row) => `${row.date} | ${row.platform} | ${row.task} | ${row.media}`)
  ];
  const stream = lines
    .slice(0, 28)
    .map((line, index) => {
      const y = 790 - index * 24;
      const size = index === 0 ? 17 : 10;
      return `BT /F1 ${size} Tf 48 ${y} Td (${pdfText(line)}) Tj ET`;
    })
    .join('\n');
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n',
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

export default function DashboardExperience({ business, setup, opening, onOpened, onEdit }: DashboardExperienceProps) {
  const [importedFile, setImportedFile] = useState('No calendar file imported yet');
  const product = business.products[0];
  const activePlatforms = setup.connectedPlatforms.length ? setup.connectedPlatforms : defaultPlatforms;

  useEffect(() => {
    if (!opening) return undefined;
    const timer = window.setTimeout(onOpened, 2300);
    return () => window.clearTimeout(timer);
  }, [onOpened, opening]);

  const calendarRows = useMemo<CalendarRow[]>(() => {
    const productName = product?.name || 'Hero Product';
    return [
      { date: 'Mon 09', platform: activePlatforms[0] || 'Facebook Page', task: 'Awareness Post', content: `${productName} brand story + customer pain point`, media: 'Photo required', status: 'Ready' },
      { date: 'Tue 10', platform: activePlatforms[1] || 'Instagram', task: 'Reel / Short Video', content: `Show ${productName} benefit in 12 seconds`, media: 'Video required', status: 'Needs media' },
      { date: 'Wed 11', platform: activePlatforms[2] || 'TikTok', task: 'Trust Builder', content: 'Before / after, review highlight, price clarity', media: 'Photo + caption', status: 'Scheduled' },
      { date: 'Fri 13', platform: activePlatforms[0] || 'Facebook Page', task: 'Sales Push', content: `Offer + CTA for ${formatCurrency(product?.price || '25000')}`, media: 'Product image', status: 'Draft' }
    ];
  }, [activePlatforms, product?.name, product?.price]);

  const orderRows = useMemo(() => [
    { app: activePlatforms[0] || 'Facebook Page', customer: 'Daw Thandar', product: product?.name || 'Hero Product', paid: formatCurrency(product?.price || '25000'), stock: '12 left', state: 'Paid' },
    { app: activePlatforms[1] || 'Instagram', customer: 'Ko Aung', product: product?.category || 'Product Set', paid: 'Pending', stock: '5 left', state: 'Follow up' },
    { app: activePlatforms[2] || 'TikTok', customer: 'Ma Ei', product: product?.name || 'Hero Product', paid: formatCurrency(product?.price || '25000'), stock: 'Low stock', state: 'Pack today' }
  ], [activePlatforms, product?.category, product?.name, product?.price]);

  function downloadCalendar(type: 'sheet' | 'pdf') {
    const name = safeFileName(business.businessName);
    if (type === 'sheet') {
      const header = 'Date,Platform,Task,Content,Media,Status';
      const body = calendarRows.map((row) => [row.date, row.platform, row.task, row.content, row.media, row.status].map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
      downloadBlob(`${name}-content-calendar.csv`, `\uFEFF${header}\n${body}`, 'text/csv;charset=utf-8');
      return;
    }
    downloadBlob(`${name}-content-calendar.pdf`, buildSimplePdf(`${business.businessName} Content Calendar`, calendarRows), 'application/pdf');
  }

  return (
    <main className={`dashboard-stage ${opening ? 'opening-mode' : 'ready-mode'}`}>
      <section className="vault-open-scene" aria-hidden="true">
        <div className="vault-glow" />
        <div className="unlock-vault-3d">
          <div className="unlock-vault-lid" />
          <div className="unlock-vault-body"><span /></div>
          <div className="unlock-vault-key"><i /></div>
        </div>
        <div className="dashboard-sheet-preview">
          <span />
          <b />
          <i />
        </div>
        <p>Opening your AI marketing command center...</p>
      </section>

      <section className="dashboard-canvas glass" aria-label="Burma MarketPilot dashboard">
        <aside className="pilot-sidebar">
          <div className="pilot-logo"><span>MP</span><strong>Burma<br />MarketPilot</strong></div>
          <div className="owner-card"><span>{business.businessName.slice(0, 2).toUpperCase()}</span><b>{business.businessName}</b><small>Business Owner · Premium Plan</small></div>
          <nav className="pilot-nav" aria-label="Dashboard navigation">
            <a className="active">Dashboard</a>
            <a>Content Calendar</a>
            <a>Orders</a>
            <a>Upload Queue</a>
            <a>Analytics</a>
          </nav>
          <div className="sidebar-tip"><b>Pro Tip</b><p>Consistent content + fast fulfillment builds trust and repeat orders.</p></div>
        </aside>

        <div className="pilot-main">
          <header className="pilot-topbar">
            <div><span className="eyebrow compact">Business DNA unlocked</span><h1>Dashboard Overview</h1><p>AI-generated marketing direction, order intelligence, and upload automation in one workspace.</p></div>
            <div className="topbar-actions"><button className="ghost-btn" type="button" onClick={onEdit}>Edit DNA</button><button className="primary-btn" type="button">+ Create Content</button></div>
          </header>

          <section className="kpi-grid" aria-label="Dashboard highlights">
            <article className="kpi-card dark"><small>Total Revenue Potential</small><b>MMK 12.45M</b><span>▲ 18.6% based on content consistency</span></article>
            <article className="kpi-card"><small>30-Day Calendar</small><b>30</b><span>Posts planned across selected apps</span></article>
            <article className="kpi-card"><small>Order Chats</small><b>1,243</b><span>Facebook, Instagram, TikTok, Messenger</span></article>
            <article className="kpi-card"><small>Auto Upload Queue</small><b>24</b><span>Ready after media confirmation</span></article>
          </section>

          <section className="feature-grid">
            <article className="feature-card content-feature">
              <div className="feature-head">
                <div><span className="feature-number">01</span><h2>Content Calendar Creator</h2><p>Professional digital marketing adviser for what to post, when to post, which platform to use, and what media is needed.</p></div>
                <div className="download-actions"><button type="button" onClick={() => downloadCalendar('sheet')}>Download Google Sheet</button><button type="button" onClick={() => downloadCalendar('pdf')}>Download PDF</button></div>
              </div>
              <div className="calendar-board">
                {calendarRows.map((row) => <div className="calendar-row" key={`${row.date}-${row.platform}`}><time>{row.date}</time><span>{row.platform}</span><b>{row.task}</b><p>{row.content}</p><em className={row.status === 'Needs media' ? 'warning' : ''}>{row.media} · {row.status}</em></div>)}
              </div>
              <div className="studio-note"><span>Burma Ai Studio</span><p>Content calendar ထဲက ပုံတွေ၊ Video တွေလိုအပ်ရင် Burma Ai Studio မှာ တစ်ခါတည်းဖန်တီးနိုင်ကြောင်း အကြံပြုထားပါတယ်။</p><button type="button">Suggest Studio Asset</button></div>
            </article>

            <article className="feature-card order-feature">
              <div className="feature-head small"><div><span className="feature-number">02</span><h2>Order Intelligence</h2><p>Social order chat list ကို analysis လုပ်ပြီး customer, app, product, paid status, stock left အားလုံးကို တစ်နေရာတည်းပြမယ်။</p></div></div>
              <div className="order-list">
                {orderRows.map((order) => <div className="order-row" key={`${order.app}-${order.customer}`}><span>{order.app.slice(0, 1)}</span><div><b>{order.customer}</b><small>{order.app} · {order.product}</small></div><p>{order.paid}</p><em>{order.stock}</em><strong>{order.state}</strong></div>)}
              </div>
            </article>

            <article className="feature-card upload-feature">
              <div className="feature-head small"><div><span className="feature-number">03</span><h2>Upload Automation</h2><p>Google Sheet သို့မဟုတ် PDF ထည့်လိုက်တာနဲ့ နေ့/အချိန်/App အလိုက် post schedule ကို auto queue ပြုလုပ်ပေးမယ်။</p></div></div>
              <label className="import-box">
                <input type="file" accept=".csv,.pdf,.xlsx,.xls" onChange={(event) => setImportedFile(event.target.files?.[0]?.name || 'No calendar file imported yet')} />
                <span>+</span><b>Import Calendar File</b><small>{importedFile}</small>
              </label>
              <div className="automation-flow"><span>Read file</span><i /><span>Ask media</span><i /><span>Daily auto queue</span><i /><span>Post</span></div>
              <div className="reminder-card"><b>1-Day Early Reminder</b><p>နောက်ရက်တင်ရမယ့် content မှာ ပုံ/Video လိုအပ်ရင် တစ်ရက်စောပြီးသတိပေးမယ်။ Auto upload မလုပ်ခင် media ကို owner ကိုယ်တိုင်ထည့်ခိုင်းမယ်။</p></div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
