import { useState } from 'react';
import { Button, Checkbox, Select, TextField, useAsyncAction } from '@serein-ui/react';
import Shell, { Recovery, focusId } from './Shell';
import { defaults, parseSettings, pause, readRecord, saveRecord, timezones, validateName } from './model';
export default function Settings() {
  const [initial] = useState(() => readRecord('settings', parseSettings));
  const [saved, setSaved] = useState(initial.value ?? defaults);
  const [draft, setDraft] = useState(saved);
  const [blocked, setBlocked] = useState(initial.error);
  const [error, setError] = useState('');
  const [fail, setFail] = useState(false);
  const action = useAsyncAction(async signal => {
    const next = { ...draft, name: draft.name.trim() }; await pause(); if (signal.aborted) return;
    if (fail) { setFail(false); throw new Error('Demo failure'); }
    saveRecord(localStorage, 'settings', next); setSaved(next); setDraft(next);
  });
  const pending = action.state === 'pending';
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  function edit(next: typeof draft) { setDraft(next); if (error) setError(validateName(next.name)); action.reset(); }
  return <Shell title="Settings" description="Make this local workspace your own. Saved preferences stay in this browser.">
    {blocked && <Recovery onRecover={() => { setBlocked(false); focusId('settings-name'); }} />}
    <form className="workflow-form" noValidate onSubmit={e => { e.preventDefault(); if (pending || blocked) return; const message = validateName(draft.name); setError(message); if (message) { focusId('settings-name'); return; } action.run(); }}>
      <fieldset disabled={pending}><legend>Profile &amp; region</legend><p className="workflow-muted">Choose the name and time zone used in this demonstration.</p><TextField id="settings-name" label="Display name" value={draft.name} error={error} onChange={e => edit({ ...draft, name: e.target.value })} autoComplete="name" /><Select label="Time zone" value={draft.timezone} onValueChange={timezone => edit({ ...draft, timezone })} options={timezones.map(zone => ({ value: zone, label: zone }))} disabled={pending} /></fieldset>
      <fieldset disabled={pending}><legend>Notifications</legend><Checkbox label="Weekly activity summary" description="Save your preference only. No messages are sent." checked={draft.notifications} onCheckedChange={notifications => edit({ ...draft, notifications })} disabled={pending} /></fieldset>
      <details className="workflow-demo"><summary>Try a save failure</summary><Checkbox label="Fail the next save" description="One attempt fails; retry keeps your edits." checked={fail} onCheckedChange={setFail} disabled={pending} /></details>
      <div className="workflow-actions"><Button type="submit" loading={pending} disabled={blocked}>{action.state === 'error' ? 'Retry save' : 'Save settings'}</Button><Button variant="secondary" disabled={pending || !dirty} onClick={() => { setDraft(saved); setError(''); action.reset(); focusId('settings-name'); }}>Reset changes</Button></div>
      <p role="status">{pending ? 'Saving locally…' : action.state === 'success' ? 'Settings saved in this browser.' : dirty ? 'You have unsaved changes.' : 'No unsaved changes.'}</p>
      {action.state === 'error' && <p role="alert" className="workflow-error">Settings were not saved. Your edits are still here. Retry; if storage is blocked or full, enable it or free space first.</p>}
    </form>
  </Shell>;
}
