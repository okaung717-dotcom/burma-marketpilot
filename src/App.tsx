import { createElement as h, useRef, useState, type CSSProperties, type ChangeEvent } from 'react';
import './AnalysisLoading.css';

type Row = [string, string, string, string, string, string, string];
type Order = [string, string, string, number, number, number, number, string];

const businessName = 'Royal Rangoon Coffee';
const productName = 'Premium Arabica Blend';
const productPrice = 25000;

const calendarRows: Row[] = [
  ['Day 01', '09:00 AM', 'Facebook Page', 'Photo + Caption', `${businessName} ရဲ့ Brand trust story နဲ့ ${productName} ကို မိတ်ဆက်ပါ။`, 'Product hero photo', 'Ready'],
  ['Day 02', '12:30 PM', 'TikTok', 'Short Video', 'Customer problem ကိုပြပြီး Product USP ကို Solution angle နဲ့ video တင်ပါ။', '15s vertical video', 'Needs media'],
  ['Day 03', '07:00 PM', 'Instagram', 'Carousel', 'Price / benefit / order CTA ကို 3-card carousel အနေနဲ့တင်ပါ။', '3 square images', 'Scheduled'],
  ['Day 04', '10:00 AM', 'Messenger', 'Poll / Question', 'Customer comment/chat order ရအောင် မေးခွန်းပုံစံ engagement post တင်ပါ။', 'Text only', 'Ready'],
  ['Day 05', '06:30 PM', 'Facebook Page', 'Review Post', 'Customer review, delivery proof, before/after proof တို့နဲ့ Social proof တည်ဆောက်ပါ။', 'Review image', 'Needs media'],
  ['Day 06', '08:30 PM', 'TikTok', 'Behind the Scenes', 'Packaging / stock preparation / delivery process ကို human-made feel နဲ့ပြပါ။', 'Process video', 'Needs media'],
  ['Day 07', '11:00 AM', 'Facebook Page', 'Conversion CTA', 'Limited stock urgency နဲ့ Message/Comment order CTA ကို ပြတ်သားစွာတင်ပါ။', 'CTA graphic', 'Scheduled']
];

const orders: Order[] = [
  ['Daw Hnin Wut Yi', 'Facebook Page', productName, 2, productPrice * 2, 0, 18, 'Paid'],
  ['Ko Aung Min', 'TikTok', productName, 1, productPrice / 2, productPrice / 2, 17, 'Partial'],
  ['Ma Su Myat', 'Messenger', productName, 3, 0, productPrice * 3, 14, 'COD'],
  ['Royal Office Pantry', 'Viber', productName, 5, productPrice * 5, 0, 9, 'Paid']
];

const sx: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', width: 'min(1440px,100%)', margin: '0 auto', padding: '24px clamp(16px,3vw,34px) 44px', position: 'relative', zIndex: 1 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 18 },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  hero: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 28, alignItems: 'center', padding: 'clamp(26px,4vw,54px)', borderRadius: 42, overflow: 'hidden' },
  h1: { margin: '16px 0', color: '#073f3a', font: '900 clamp(42px,6vw,84px)/.92 Manrope,sans-serif', letterSpacing: '-.075em' },
  p: { color: 'var(--muted)', lineHeight: 1.7, fontSize: 15 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(135px,1fr))', gap: 14, marginTop: 30 },
  stat: { padding: 16, borderRadius: 22, minHeight: 100, background: 'rgba(255,255,255,.64)', border: '1px solid rgba(0,97,89,.08)' },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(340px,.75fr)', gap: 22, marginTop: 22, alignItems: 'start' },
  card: { borderRadius: 34, padding: 'clamp(22px,3vw,34px)', overflow: 'hidden' },
  title: { margin: '8px 0', font: '900 clamp(28px,3vw,42px)/1 Manrope,sans-serif', letterSpacing: '-.055em' },
  tableWrap: { overflow: 'auto', borderRadius: 26, border: '1px solid rgba(0,97,89,.08)', background: 'rgba(255,255,255,.58)' },
  table: { width: '100%', minWidth: 850, borderCollapse: 'collapse' },
  th: { padding: '15px 13px', textAlign: 'left', color: 'var(--primary)', background: 'rgba(223,245,240,.68)', font: '900 11px Manrope,sans-serif', textTransform: 'uppercase', letterSpacing: '.1em' },
  td: { padding: '15px 13px', borderTop: '1px solid rgba(217,224,222,.74)', verticalAlign: 'top', fontSize: 13, lineHeight: 1.55 },
  smallCard: { padding: 16, borderRadius: 22, background: 'rgba(255,255,255,.64)', border: '1px solid rgba(0,97,89,.08)' },
  orb: { width: 180, height: 180, margin: '0 auto', display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#fffdf4', background: 'linear-gradient(145deg,var(--primary-2),#062f2b 82%)', boxShadow: 'inset -18px -28px 42px rgba(0,0,0,.2),0 35px 90px rgba(0,97,89,.24)' },
  upload: { width: '100%', minHeight: 132, display: 'grid', placeItems: 'center', gap: 6, padding: 22, border: '2px dashed rgba(0,97,89,.28)', borderRadius: 28, color: 'var(--primary)', background: 'rgba(223,245,240,.54)' }
};

function brand() {
  return h('div', { className: 'brand-mark' }, h('span', { className: 'brand-icon' }, 'MP'), h('span', null, 'Burma MarketPilot'), h('i'));
}

function button(label: string, kind: 'primary' | 'ghost', onClick: () => void) {
  return h('button', { type: 'button', className: kind === 'primary' ? 'primary-btn' : 'ghost-btn', onClick }, label);
}

function money(value: number) {
  return `${value.toLocaleString()} MMK`;
}

function statusStyle(status: string): CSSProperties {
  const base: CSSProperties = { display: 'inline-flex', minHeight: 28, alignItems: 'center', padding: '0 10px', borderRadius: 999, font: '900 11px Manrope,sans-serif', fontStyle: 'normal' };
  if (status === 'Needs media' || status === 'Partial') return { ...base, color: '#784d00', background: 'rgba(255,185,87,.24)' };
  if (status === 'COD') return { ...base, color: 'var(--secondary)', background: 'rgba(87,91,137,.12)' };
  return { ...base, color: 'var(--primary)', background: 'rgba(223,245,240,.9)' };
}

function stat(big: string, small: string) {
  return h('div', { style: sx.stat }, h('b', { style: { display: 'block', font: '900 22px Manrope,sans-serif' } }, big), h('span', { style: sx.p }, small));
}

function downloadCsv() {
  const all = [['Day', 'Time', 'Platform', 'Content Type', 'Marketing Action', 'Asset Needed', 'Status'], ...calendarRows];
  const csv = all.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'burma-marketpilot-content-calendar-google-sheet.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function AnalysisView({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  const boxMove = opening ? 'translateX(-50%) translateY(92px) scale(.72)' : 'translateX(-50%) scale(.82)';
  const lidMove = opening ? 'rotateX(70deg) translateY(-52px)' : 'rotateX(0deg)';

  return h(
    'main',
    { className: 'analysis-page' },
    h('div', { className: 'analysis-brand-row' }, brand(), h('span', { className: 'ai-partner-pill' }, 'AI-Powered Growth Partner')),
    h(
      'section',
      { className: 'analysis-card glass ready' },
      h(
        'header',
        { className: 'analysis-heading', style: { opacity: opening ? 0.18 : 1, transition: '600ms ease' } },
        h('h1', null, 'Analyzing Your Business DNA'),
        h('p', null, 'AI is reading your business data and building your growth key.'),
        h('div', { className: 'analysis-meta' }, h('span', null, 'Processing your data securely'), h('i'), h('b', null, 'Estimated time remaining: 00:00'))
      ),
      h(
        'ol',
        { className: 'analysis-steps', style: { opacity: opening ? 0.18 : 1, transition: '600ms ease' } },
        ['Collect Data', 'AI Reads', 'AI Thinks', 'Generate key', 'Unlock'].map((label) =>
          h('li', { key: label, className: 'done active' }, h('span', null, 'OK'), h('b', null, label))
        )
      ),
      h(
        'div',
        { className: 'analysis-showcase' },
        h('div', { className: 'analysis-callout' }, h('span'), h('p', null, opening ? 'Dashboard workspace is coming out from the growth box.' : 'Your growth key is ready.')),
        h(
          'div',
          { className: 'vault-zone inserted', style: { transform: boxMove, transition: '850ms cubic-bezier(.2,.85,.2,1)', zIndex: 18 } },
          h('div', { className: 'vault-rings' }),
          h(
            'div',
            { className: 'vault-3d' },
            h('div', { className: 'vault-lid', style: { transform: lidMove, transformOrigin: '18px 42px', transition: '850ms cubic-bezier(.2,.85,.2,1)' } }),
            h('div', { className: 'vault-body' }),
            h('div', { className: 'vault-slot' }),
            h('div', { className: 'token' }, h('span'))
          ),
          h('button', { className: 'open-results-btn', type: 'button', onClick: onOpen, disabled: opening, style: { opacity: opening ? 0 : 1, transition: '450ms ease' } }, opening ? 'Opening...' : 'Open'),
          h('p', { className: 'analysis-complete-text' }, 'Analysis complete - unlock your plan.')
        ),
        opening
          ? h(
              'div',
              { style: { position: 'absolute', inset: 0, zIndex: 16, display: 'grid', placeItems: 'center', pointerEvents: 'none' } },
              h(
                'div',
                {
                  style: {
                    width: 'min(880px,78vw)',
                    height: 'min(430px,62vh)',
                    borderRadius: 28,
                    background: 'linear-gradient(145deg,rgba(255,255,255,.96),rgba(244,244,241,.88))',
                    boxShadow: '0 46px 110px rgba(26,28,27,.18)',
                    border: '1px solid rgba(0,97,89,.12)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--primary)',
                    font: '900 30px Manrope,sans-serif'
                  }
                },
                'MarketPilot Dashboard'
              )
            )
          : null
      )
    )
  );
}

function Dashboard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileState, setFileState] = useState('No Google Sheet / PDF imported yet.');
  const [queued, setQueued] = useState(false);
  const alerts = calendarRows.filter((row) => row[6] === 'Needs media');
  const paid = orders.reduce((sum, row) => sum + row[4], 0);
  const due = orders.reduce((sum, row) => sum + row[5], 0);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileState(`${file.name} imported. Auto upload queue prepared.`);
    setQueued(true);
  }

  return h(
    'main',
    { style: sx.page },
    h('section', { style: sx.top }, brand(), h('div', { style: sx.row }, button('Download Google Sheet', 'primary', downloadCsv), button('Download PDF', 'ghost', () => window.print()))),
    h(
      'section',
      { className: 'glass', style: sx.hero },
      h(
        'div',
        null,
        h('span', { className: 'eyebrow' }, 'AI Growth Workspace Unlocked'),
        h('h1', { style: sx.h1 }, 'MarketPilot Dashboard'),
        h('p', { style: sx.p }, 'Business DNA Analysis ပြီးသွားပါပြီ။ Content Calendar, Social Order Chat Analysis, Auto Upload Scheduler နဲ့ Burma Ai Studio asset recommendation ကို တစ်နေရာတည်းမှာ ထိန်းချုပ်နိုင်တဲ့ Dashboard UI ဖြစ်ပါတယ်။'),
        h('div', { style: sx.stats }, stat(String(calendarRows.length), 'Scheduled posts'), stat('4', 'Connected apps'), stat(money(paid), 'Paid order value'), stat(String(alerts.length), 'Media alerts'))
      ),
      h('div', { style: sx.orb }, h('b', { style: { font: '900 52px Manrope,sans-serif' } }, 'AI'))
    ),
    h(
      'section',
      { style: sx.grid },
      h(
        'article',
        { className: 'glass', style: { ...sx.card, gridRow: 'span 3' } },
        h(
          'div',
          { style: sx.top },
          h('div', null, h('span', { className: 'eyebrow' }, 'Professional Digital Marketing Plan'), h('h2', { style: sx.title }, 'Content Calendar'), h('p', { style: sx.p }, 'Products အတွက် ဘယ်နေ့မှာ ဘယ် Social platform မှာ စာ/ပုံ/ဗီဒီယို ဘာတင်ရမလဲဆိုတာ AI Marketing Professional အနေနဲ့ အကြံပေးထားပါတယ်။')),
          h('div', { style: sx.row }, button('Google Sheet', 'primary', downloadCsv), button('PDF', 'ghost', () => window.print()))
        ),
        h(
          'div',
          { style: sx.tableWrap },
          h(
            'table',
            { style: sx.table },
            h('thead', null, h('tr', null, ['Day / Time', 'Platform', 'Content', 'Marketing Action', 'Asset', 'Status'].map((head) => h('th', { key: head, style: sx.th }, head)))),
            h(
              'tbody',
              null,
              calendarRows.map((row) =>
                h(
                  'tr',
                  { key: `${row[0]}-${row[2]}` },
                  h('td', { style: sx.td }, h('b', null, row[0]), h('br'), row[1]),
                  h('td', { style: sx.td }, row[2]),
                  h('td', { style: sx.td }, row[3]),
                  h('td', { style: sx.td }, row[4]),
                  h('td', { style: sx.td }, row[5]),
                  h('td', { style: sx.td }, h('em', { style: statusStyle(row[6]) }, row[6]))
                )
              )
            )
          )
        ),
        h('aside', { style: { ...sx.smallCard, marginTop: 22, background: 'rgba(255,250,239,.78)', borderColor: 'rgba(255,185,87,.35)' } }, h('b', null, 'Burma Ai Studio Recommendation'), h('p', { style: sx.p }, 'Content calendar ထဲက ပုံ/ဗီဒီယို မရှိသေးရင် Burma Ai Studio မှာ ဖန်တီးနိုင်ပါတယ်။ Product photo, short video, carousel image တွေကို deadline မတိုင်ခင် တစ်ရက်စောပြီး ပြင်ဆင်ပါ။'))
      ),
      h(
        'div',
        { style: { display: 'grid', gap: 22 } },
        h(
          'article',
          { className: 'glass', style: sx.card },
          h('span', { className: 'eyebrow' }, 'Social Account Order Chat Analysis'),
          h('h2', { style: sx.title }, 'Order'),
          h('p', { style: sx.p }, 'Order chat list တွေကို Analysis လုပ်ပြီး Customer / Social App / Payment / Stock ကို တစ်နေရာတည်းပြထားပါတယ်။'),
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '18px 0' } }, stat(money(paid), 'Paid'), stat(money(due), 'Remaining')),
          h('div', { style: { display: 'grid', gap: 12 } }, orders.map((order) => h('div', { key: `${order[0]}-${order[1]}`, style: sx.smallCard }, h('b', null, `${order[0]} • ${order[1]}`), h('p', { style: sx.p }, `${order[2]} x ${order[3]} / Paid ${money(order[4])} / Remain ${money(order[5])} / Stock ${order[6]}`), h('em', { style: statusStyle(order[7]) }, order[7]))))
        ),
        h(
          'article',
          { className: 'glass', style: sx.card },
          h('span', { className: 'eyebrow' }, 'PDF / Google Sheet Auto Upload'),
          h('h2', { style: sx.title }, 'Upload Features'),
          h('p', { style: sx.p }, 'Content Calendar file ထည့်လိုက်တာနဲ့ Daily ဘယ်အချိန် ဘယ် App မှာ ဘာတင်မလဲဆိုတာ Auto Queue ပြုလုပ်ပေးမယ်။ ပုံ/ဗီဒီယိုလိုတဲ့ post တွေကို မတင်ခင် တစ်ရက်စောပြီး သတိပေးမယ်။'),
          h('input', { ref: inputRef, type: 'file', accept: '.csv,.xlsx,.xls,.pdf', hidden: true, onChange: handleFile }),
          h('button', { type: 'button', style: sx.upload, onClick: () => inputRef.current?.click() }, h('b', null, '+ Upload Calendar File'), h('small', null, 'Google Sheet / Excel / PDF')),
          h('p', { style: sx.p }, fileState),
          h('div', { style: sx.smallCard }, h('b', null, queued ? 'Auto-post queue prepared' : 'Waiting for calendar file'), h('p', { style: sx.p }, 'Auto upload အချိန်မှာ ပုံ/ဗီဒီယိုတွေကို ကိုယ်တိုင်ထည့်ခိုင်းမယ်။'))
        ),
        h('article', { className: 'glass', style: sx.card }, h('span', { className: 'eyebrow' }, '1-Day Early Reminder'), h('h2', { style: sx.title }, 'Media Needed'), alerts.map((alert) => h('div', { key: `${alert[0]}-${alert[5]}`, style: { ...sx.smallCard, marginTop: 10 } }, h('b', null, `${alert[0]} - ${alert[5]}`), h('p', { style: sx.p }, `${alert[2]} မှာ ${alert[1]} တင်ရန် တစ်ရက်စောပြီး ပြင်ဆင်ပါ။`))))
      )
    )
  );
}

export default function App() {
  const [dashboard, setDashboard] = useState(false);
  const [opening, setOpening] = useState(false);

  function openDashboard() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setDashboard(true), 1050);
  }

  return h(
    'div',
    { className: 'app-shell' },
    h('div', { className: 'progress-track' }, h('span', { style: { width: dashboard ? '100%' : '99%' } })),
    h('div', { className: 'ambient ambient-one' }),
    h('div', { className: 'ambient ambient-two' }),
    dashboard ? h(Dashboard) : h(AnalysisView, { opening, onOpen: openDashboard })
  );
}
