import type { BusinessDraft, SetupDraft } from './types';

export default function AnalysisLoadingPage({ business, setup, onOpen }: { business: BusinessDraft; setup: SetupDraft; onOpen: () => void }) {
  return (
    <main className="analysis-page">
      <h1>Analyzing Your Business DNA</h1>
      <p>{business.businessName} is being prepared for {setup.postingFrequency} marketing.</p>
      <button type="button" onClick={onOpen}>Open</button>
    </main>
  );
}
