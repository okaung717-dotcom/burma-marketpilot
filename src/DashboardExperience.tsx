import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { BusinessDraft, SetupDraft } from './types';
import './DashboardExperience.css';
import './GlobalThemeFixes.css';
import './DashboardViewportFit.css';

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

type DashboardPanel = 'dashboard' | 'calendar' | 'orders' | 'upload' | 'analytics';

type ActionModal = {
  title: string;
  description: string;
  primary?: string;
  secondary?: string;
};

const defaultPlatforms = ['Facebook Page', 'Instagram', 'TikTok', 'Messenger'];
const noImportedFile = 'No calendar file imported yet';

const panelCopy: Record<DashboardPanel, { label: string; title: string; subtitle: string }> = {
  dashboard: {
    label: 'Dashboard',
    title: 'Dashboard Overview',
    subtitle: 'AI-generated marketing direction, order intelligence, and upload automation in one workspace.'
  },
  calendar: {
    label: 'Content Calendar',
    title: 'Content Calendar Workspace',
    subtitle: 'Click a row, export the calendar, or send missing media to Burma Ai Studio.'
  },
  orders: {
    label: 'Orders',
    title: 'Order Intelligence Workspace',
    subtitle: 'Open each order to see the next action for customer, product, status, and stock.'
  },
  upload: {
    label: 'Upload Queue',
    title: 'Upload Queue Workspace',
    subtitle: 'Import a calendar file and confirm media before the auto queue is marked ready.'
  },
  analytics: {
    label: 'Analytics',
    title: 'Analytics Workspace',
    subtitle: 'Review revenue potential, posting consistency, order flow, and automation status.'
  }
};

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

export default function DashboardExperience({ business, setup, opening, onOpened, onEdit }: DashboardExperienceProps) {
  const [importedFile, setImportedFile] = useState(noImportedFile);
  const [activePanel, setActivePanel] = useState<DashboardPanel>('dashboard');
  const [notice, setNotice] = useState<string | null>(null);
  const [modal, setModal] = useState<ActionModal | null>(null);
  const [queueReady, setQueueReady] = useState(false);
  const [mediaConfirmed, setMediaConfirmed] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const product = business.products[0];
  const productName = product?.name || 'Hero Product';
  const activePlatforms = setup.connectedPlatforms.length ? setup.connectedPlatforms : defaultPlatforms;
  const currentPanel = panelCopy[activePanel];

  useEffect(() => {
    if (!opening) return undefined;
    const timer = window.setTimeout(onOpened, 2300);
    return () => window.clearTimeout(timer);
  }, [onOpened, opening]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const calendarRows = useMemo<CalendarRow[]>(() => [
    { date: 'Mon 09', platform: activePlatforms[0] || 'Facebook Page', task: 'Awareness Post', content: `${productName} brand story + customer pain point`, media: 'Photo required', status: 'Ready' },
    { date: 'Tue 10', platform: activePlatforms[1] || 'Instagram', task: 'Reel / Short Video', content: `Show ${productName} benefit in 12 seconds`, media: 'Video required', status: mediaConfirmed ? 'Media ready' : 'Needs media' },
    { date: 'Wed 11', platform: activePlatforms[2] || 'TikTok', task: 'Trust Builder', content: 'Before / after, review highlight, price clarity', media: 'Photo + caption', status: 'Scheduled' },
    { date: 'Fri 13', platform: activePlatforms[0] || 'Facebook Page', task: 'Sales Push', content: `Offer + CTA for ${formatCurrency(product?.price || '25000')}`, media: 'Product image', status: queueReady ? 'Queued' : 'Draft' }
  ], [activePlatforms, mediaConfirmed, product?.price, productName, queueReady]);

  const orderRows = useMemo(() => [
    { app: activePlatforms[0] || 'Facebook Page', customer: 'Daw Thandar', product: productName, paid: formatCurrency(product?.price || '25000'), stock: '12 left', state: 'Paid' },
    { app: activePlatforms[1] || 'Instagram', customer: 'Ko Aung', product: product?.category || 'Product Set', paid: 'Pending', stock: '5 left', state: 'Follow up' },
    { app: activePlatforms[2] || 'TikTok', customer: 'Ma Ei', product: productName, paid: formatCurrency(product?.price || '25000'), stock: 'Low stock', state: 'Pack today' }
  ], [activePlatforms, product?.category, product?.price, productName]);

  function showAction(title: string, description: string, panel: DashboardPanel = activePanel, primary?: string, secondary?: string) {
    setActivePanel(panel);
    setModal({ title, description, primary, secondary });
    setNotice(`${title} opened.`);
  }

  function downloadCalendar(type: 'sheet' | 'pdf') {
    const name = safeFileName(business.businessName);
    const header = 'Date,Platform,Task,Content,Media,Status';
    const body = calendarRows.map((row) => [row.date, row.platform, row.task, row.content, row.media, row.status].map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    if (type === 'sheet') {
      downloadBlob(`${name}-content-calendar.csv`, `\uFEFF${header}\n${body}`, 'text/csv;charset=utf-8');
      setNotice('Google-Sheet-ready CSV downloaded.');
      return;
    }
    downloadBlob(`${name}-content-calendar.pdf`, `${business.businessName} Content Calendar\n\n${header}\n${body}`, 'application/pdf;charset=utf-8');
    setNotice('PDF file downloaded.');
  }

  function downloadBrief(label: string, content: string) {
    downloadBlob(`${safeFileName(business.businessName)}-${label}.txt`, content, 'text/plain;charset=utf-8');
    setNotice(`${label} file downloaded.`);
  }

  function createContent() {
    const nextCount = generatedCount + 1;
    setGeneratedCount(nextCount);
    showAction(
      `AI Content Draft #${nextCount}`,
      `${productName} content draft is generated from the business goal, target audience, and current offer.`,
      'calendar',
      `Caption: Introduce ${productName} with a premium trust angle for ${business.targetAudience}. Offer: ${business.currentPromotion || 'Order today'}. CTA: Message us to order.`,
      'Media: clean product photo, price badge, warm Myanmar premium lighting.'
    );
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const fileName = event.target.files?.[0]?.name || noImportedFile;
    setImportedFile(fileName);
    setQueueReady(fileName !== noImportedFile);
    showAction('Calendar File Imported', `${fileName} is now read into the upload queue preview.`, 'upload', 'Next: confirm photo/video media before queueing.');
  }

  function confirmMedia() {
    setMediaConfirmed(true);
    setQueueReady(true);
    showAction('Media Confirmed', 'Photo/video media is confirmed. Upload Queue changed to Ready state.', 'upload');
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
          <div className="owner-card"><span>{business.businessName.slice(0, 2).toUpperCase()}</span><b>{business.businessName}</b><small>Business Owner - Premium Plan</small></div>
          <nav className="pilot-nav" aria-label="Dashboard navigation">
            {(Object.keys(panelCopy) as DashboardPanel[]).map((panel) => <button type="button" key={panel} className={activePanel === panel ? 'active' : ''} onClick={() => showAction(panelCopy[panel].label, panelCopy[panel].subtitle, panel)}>{panelCopy[panel].label}</button>)}
          </nav>
          <div className="sidebar-tip"><b>Pro Tip</b><p>Consistent content + fast fulfillment builds trust and repeat orders.</p></div>
        </aside>

        <div className="pilot-main">
          <header className="pilot-topbar">
            <div><span className="eyebrow compact">Business DNA unlocked</span><h1>{currentPanel.title}</h1><p>{currentPanel.subtitle}</p></div>
            <div className="topbar-actions"><button className="ghost-btn" type="button" onClick={onEdit}>Edit DNA</button><button className="primary-btn" type="button" onClick={createContent}>+ Create Content</button></div>
          </header>

          <section className="kpi-grid" aria-label="Dashboard highlights">
            <button type="button" className="kpi-card dark kpi-clickable" onClick={() => showAction('Revenue Potential', 'Revenue estimate is calculated from product price, posting rhythm, and selected platform consistency.', 'analytics', 'MMK 12.45M', 'up 18.6% based on content consistency')}><small>Total Revenue Potential</small><b>MMK 12.45M</b><span>up 18.6% based on content consistency</span></button>
            <button type="button" className="kpi-card kpi-clickable" onClick={() => showAction('30-Day Calendar', 'Open calendar rows, export files, and prepare missing media.', 'calendar')}><small>30-Day Calendar</small><b>30</b><span>Posts planned across selected apps</span></button>
            <button type="button" className="kpi-card kpi-clickable" onClick={() => showAction('Order Chats', 'Order chat intelligence is grouped by customer, app, product, paid status, and stock left.', 'orders')}><small>Order Chats</small><b>1,243</b><span>{activePlatforms.slice(0, 4).join(', ')}</span></button>
            <button type="button" className="kpi-card kpi-clickable" onClick={() => showAction('Auto Upload Queue', queueReady ? 'Queue is ready after calendar file import.' : 'Import a calendar file first, then confirm media before posting.', 'upload')}><small>Auto Upload Queue</small><b>{queueReady ? 'Ready' : '24'}</b><span>{queueReady ? 'Queue prepared' : 'Ready after media confirmation'}</span></button>
          </section>

          <section className="feature-grid">
            <article className="feature-card content-feature">
              <div className="feature-head">
                <div><span className="feature-number">01</span><h2>Content Calendar Creator</h2><p>Professional digital marketing adviser for what to post, when to post, which platform to use, and what media is needed.</p></div>
                <div className="download-actions"><button type="button" onClick={() => downloadCalendar('sheet')}>Download Google Sheet</button><button type="button" onClick={() => downloadCalendar('pdf')}>Download PDF</button></div>
              </div>
              <div className="calendar-board">
                {calendarRows.map((row) => <button type="button" className="calendar-row" key={`${row.date}-${row.platform}`} onClick={() => showAction(`${row.date} - ${row.platform}`, `${row.task}: ${row.content}`, 'calendar', `${row.media} - ${row.status}`)}><time>{row.date}</time><span>{row.platform}</span><b>{row.task}</b><p>{row.content}</p><em className={row.status === 'Needs media' ? 'warning' : ''}>{row.media} - {row.status}</em></button>)}
              </div>
              <div className="studio-note"><span>Burma Ai Studio</span><p>When the calendar needs product photos or short videos, prepare the media brief and create the asset in Burma Ai Studio.</p><button type="button" onClick={() => showAction('Studio Asset Brief', `${productName} image/video asset brief is ready for Burma Ai Studio.`, 'calendar', 'Prompt: premium Myanmar product visual, clean background, trust badge, price clarity.')}>Suggest Studio Asset</button></div>
            </article>

            <article className="feature-card order-feature">
              <div className="feature-head small"><div><span className="feature-number">02</span><h2>Order Intelligence</h2><p>Social order chats are organized by customer, app, product, paid status, and stock left.</p></div></div>
              <div className="order-list">
                {orderRows.map((order) => <button type="button" className="order-row" key={`${order.app}-${order.customer}`} onClick={() => showAction(order.customer, `${order.app} order for ${order.product} is currently in ${order.state} state.`, 'orders', `${order.paid} - ${order.stock}`)}><span>{order.app.slice(0, 1)}</span><div><b>{order.customer}</b><small>{order.app} - {order.product}</small></div><p>{order.paid}</p><em>{order.stock}</em><strong>{order.state}</strong></button>)}
              </div>
            </article>

            <article className="feature-card upload-feature">
              <div className="feature-head small"><div><span className="feature-number">03</span><h2>Upload Automation</h2><p>Import a Google Sheet or PDF calendar and convert it into a daily schedule queue by date, time, and app.</p></div></div>
              <label className="import-box">
                <input type="file" accept=".csv,.pdf,.xlsx,.xls" onChange={handleImport} />
                <span>{queueReady ? 'OK' : '+'}</span><b>Import Calendar File</b><small>{importedFile}</small>
              </label>
              <div className={`automation-flow ${queueReady ? 'is-active' : ''}`}><button type="button" onClick={() => showAction('Read file', importedFile, 'upload')}>Read file</button><i /><button type="button" onClick={() => showAction('Ask media', 'Missing media list is ready for owner confirmation.', 'upload')}>Ask media</button><i /><button type="button" onClick={confirmMedia}>Daily auto queue</button><i /><button type="button" onClick={() => showAction('Post', mediaConfirmed ? 'Posting queue is ready.' : 'Confirm media first before posting.', 'upload')}>Post</button></div>
              <div className="reminder-card"><b>1-Day Early Reminder</b><p>If tomorrow content needs photo/video media, the owner receives one-day-early preparation guidance before the queue is confirmed.</p></div>
            </article>
          </section>
        </div>
      </section>

      {notice ? <div className="dashboard-toast" role="status">{notice}</div> : null}
      {modal ? (
        <div className="dashboard-modal-backdrop" onClick={() => setModal(null)}>
          <section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setModal(null)}>x</button>
            <span className="modal-eyebrow">Live action</span>
            <h2 id="dashboard-modal-title">{modal.title}</h2>
            <p>{modal.description}</p>
            {modal.primary ? <strong>{modal.primary}</strong> : null}
            {modal.secondary ? <small>{modal.secondary}</small> : null}
            <div className="modal-actions">
              <button type="button" onClick={() => downloadBrief('action-brief', `${modal.title}\n\n${modal.description}\n${modal.primary || ''}\n${modal.secondary || ''}`)}>Download Action Brief</button>
              <button type="button" onClick={() => setModal(null)}>Done</button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
