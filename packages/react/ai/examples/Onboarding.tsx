import { useState } from 'react';
import { Button, Checkbox, TextField, useAsyncAction } from '@serein-ui/react';
import Shell, { Recovery, focusId } from './Shell';
import { parseWorkspace, pause, readRecord, saveRecord, storageKey, validateName } from './model';
export default function Onboarding() {
  const [initial] = useState(() => readRecord('onboarding', parseWorkspace));
  const [draft, setDraft] = useState(initial.value ?? { name: '', digest: true });
  const [complete, setComplete] = useState(!!initial.value); const [blocked, setBlocked] = useState(initial.error);
  const [step, setStep] = useState(0); const [error, setError] = useState(''); const [restartError, setRestartError] = useState(false); const [fail, setFail] = useState(false);
  const action = useAsyncAction(async signal => { await pause(); if (signal.aborted) return; if (fail) { setFail(false); throw new Error('Demo failure'); } saveRecord(localStorage, 'onboarding', { ...draft, name: draft.name.trim() }); setComplete(true); focusId('onboarding-complete'); });
  function move(next: number) { setStep(next); action.reset(); focusId('onboarding-step'); }
  const pending = action.state === 'pending';
  function restart() { try { localStorage.removeItem(storageKey('onboarding')); setComplete(false); setDraft({ name: '', digest: true }); setStep(0); setError(''); setRestartError(false); action.reset(); focusId('workspace-name'); } catch { setRestartError(true); } }
  return <Shell title="Set up your workspace" description="A three-step local example. No account or real workspace is created.">
    {blocked && <Recovery onRecover={() => { setBlocked(false); focusId(step === 0 ? 'workspace-name' : 'onboarding-step'); }} />}
    {complete ? <section className="workflow-complete"><h2 id="onboarding-complete" tabIndex={-1}>{draft.name} is ready to explore</h2><p>Your example setup is saved in this browser. Weekly summary preference: {draft.digest ? 'on' : 'off'}.</p><div className="workflow-actions"><a href="?view=catalogue">Explore the component catalogue</a><Button variant="secondary" onClick={restart}>Restart setup</Button></div>{restartError && <p role="alert" className="workflow-error">Could not clear saved setup. Enable browser storage, then retry restart.</p>}</section> : <>
    <ol className="workflow-steps" aria-label="Setup progress">{['Workspace', 'Preferences', 'Review'].map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined}>{index + 1}. {label}{index < step ? ' · Done' : ''}</li>)}</ol>
    <form className="workflow-form" noValidate onSubmit={e => { e.preventDefault(); if (pending) return; if (step === 0) { const message = validateName(draft.name); setError(message); if (message) { focusId('workspace-name'); return; } setDraft({ ...draft, name: draft.name.trim() }); } if (step < 2) move(step + 1); else if (!blocked) action.run(); }}>
      <h2 id="onboarding-step" tabIndex={-1}>{['Name your workspace', 'Choose your preferences', 'Review your setup'][step]}</h2>
      {step === 0 && <><p className="workflow-muted">Use a team or project name. You can return to edit it before finishing.</p><TextField id="workspace-name" label="Workspace name" value={draft.name} error={error} onChange={e => { setDraft({ ...draft, name: e.target.value }); if (error) setError(validateName(e.target.value)); }} autoComplete="organization" /></>}
      {step === 1 && <Checkbox label="Weekly workspace summary" description="This saves a preference only; no notifications are delivered." checked={draft.digest} onCheckedChange={digest => setDraft({ ...draft, digest })} />}
      {step === 2 && <><dl className="workflow-facts"><div><dt>Workspace</dt><dd>{draft.name}</dd></div><div><dt>Weekly summary</dt><dd>{draft.digest ? 'On' : 'Off'}</dd></div></dl><p className="workflow-muted">Finishing saves this example setup locally. Reloading returns to the completion screen.</p><details className="workflow-demo"><summary>Try a completion failure</summary><Checkbox label="Fail the next completion" checked={fail} onCheckedChange={setFail} disabled={pending} /></details></>}
      <div className="workflow-actions">{step > 0 && <Button variant="secondary" disabled={pending} onClick={() => move(step - 1)}>Back</Button>}<Button type="submit" loading={pending} disabled={step === 2 && blocked}>{step < 2 ? 'Continue' : action.state === 'error' ? 'Retry completion' : 'Finish local setup'}</Button></div><p role="status">{pending ? 'Saving local setup…' : 'Unfinished steps are kept only while this page is open.'}</p>{action.state === 'error' && <p role="alert" className="workflow-error">Setup was not saved. Your choices are still here. Retry; if browser storage is blocked or full, enable it or free space first.</p>}
    </form></>}
  </Shell>;
}
