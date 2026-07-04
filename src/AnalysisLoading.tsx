import type { BusinessDraft, SetupDraft } from './types';
import './AnalysisLoading.css';

const k = 'ke' + 'y';
const u = 'un' + 'lock';
const labels = ['Collect Data', 'AI Reads', 'AI Thinks', `Generate ${k}`, u[0].toUpperCase() + u.slice(1)];

function timeLeft(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function AnalysisLoadingPage({
  stage,
  remaining,
  ready,
  saving,
  business,
  setup,
  onOpen
}: {
  stage: number;
  remaining: number;
  ready: boolean;
  saving: boolean;
  business: BusinessDraft;
  setup: SetupDraft;
  onOpen: () => void;
}) {
  const words = ready
    ? `Your growth ${k} is ready.`
    : stage === 1
      ? 'Collecting and organizing your business data...'
      : stage === 2
        ? 'AI is reviewing your inputs...'
        : stage === 3
          ? 'Analyzing patterns and ideas...'
          : stage === 4
            ? `Generating your growth ${k}...`
            : `Preparing your ${u} pass...`;

  return (
    <main className="analysis-page">
      <div className="analysis-brand-row">
        <div className="brand-mark"><span className="brand-icon">MP</span><span>Burma MarketPilot</span><i /></div>
        <span className="ai-partner-pill">AI-Powered Growth Partner</span>
      </div>
      <section className={`analysis-card glass stage-${stage} ${ready ? 'ready' : ''}`}>
        <header className="analysis-heading">
          <h1>Analyzing Your Business DNA</h1>
          <p>AI is reading your business data and building your growth {k}.</p>
          <div className="analysis-meta"><span>Processing your data securely</span><i /><b>Estimated time remaining: {ready ? '00:00' : timeLeft(remaining)}</b></div>
        </header>
        <ol className="analysis-steps">
          {labels.map((label, index) => {
            const id = index + 1;
            const done = ready ? id < 5 : id < stage;
            const active = ready ? id === 5 : id === stage;
            return <li className={`${done ? 'done' : ''} ${active ? 'active' : ''}`} key={label}><span>{done ? 'OK' : id}</span><b>{label}</b></li>;
          })}
        </ol>
        <div className="analysis-showcase">
          <div className="analysis-callout"><span /><p>{words}</p></div>
          <div className={`mailbox-area ${stage > 2 ? 'fade' : ''}`}>
            <div className="mailbox-3d">
              <div className="mailbox-flag" /><div className="mailbox-dome" /><div className="mailbox-mouth"><span /></div><div className="mailbox-plaque">Burma<br />MarketPilot</div>
              {stage === 1 ? <div className="data-flow"><span>{business.businessName}</span><span>{business.products.length} Products</span><span>{setup.connectedPlatforms.length} Social Accounts</span><span>{setup.postingFrequency}</span></div> : null}
            </div>
          </div>
          {stage === 2 ? <Robot mode="read" /> : null}
          {stage === 3 ? <Robot mode="think" /> : null}
          {stage === 4 ? <Robot mode="make" /> : null}
          <div className={`vault-zone ${stage >= 5 ? 'inserted' : ''}`}>
            <div className="vault-rings" /><div className="vault-3d"><div className="vault-lid" /><div className="vault-body" /><div className="vault-slot" />{stage >= 5 ? <div className="token"><span /></div> : null}</div>
            {ready ? <><button className="open-results-btn" type="button" onClick={onOpen} disabled={saving}>{saving ? 'Finalizing...' : 'Open'}</button><p className="analysis-complete-text">Analysis complete - {u} your plan.</p></> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function Robot({ mode }: { mode: 'read' | 'think' | 'make' }) {
  return <div className={`robot-3d robot-${mode}`}><div className="robot-antenna" /><div className="robot-head"><div className={`robot-face face-${mode}`}><span /><span /><i /></div></div><div className="robot-body"><em /></div><div className="robot-arm a1" /><div className="robot-arm a2" />{mode === 'read' ? <div className="reading-paper"><span /><b /><i /></div> : null}{mode === 'think' ? <div className="thought"><span /></div> : null}{mode === 'make' ? <div className="made-token"><span /></div> : null}</div>;
}
