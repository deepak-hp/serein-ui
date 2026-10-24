import { SettingsForm } from './settings-form';

export default function Page() {
  return (
    <main className="page-shell" data-testid="server-shell">
      <header className="page-header">
        <p className="eyebrow">Internal consumer fixture</p>
        <h1>Serein workspace settings</h1>
        <p>Server-rendered App Router shell with an interactive package-based form.</p>
      </header>
      <SettingsForm initialName="" initialTeam="design" initialSummary={false} />
    </main>
  );
}
