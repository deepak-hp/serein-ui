import { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Button, CommandPalette, MultiSelect, RadioGroup, Switch, Tabs, TextField } from '../src/index';
import './workspace-settings.css';

const projects = [
  { value: 'design', label: 'Design system' },
  { value: 'website', label: 'Website' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'archive', label: 'Archived projects', disabled: true },
];
const initialSettings = { name: 'Deepak Studio', projects: ['design', 'website'], email: true, cadence: 'daily' };

/** An in-memory composition example; saving does not contact a server. */
export function WorkspaceSettingsExample() {
  const [draft, setDraft] = useState(initialSettings);
  const [saved, setSaved] = useState(initialSettings);
  const [section, setSection] = useState('general');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState<string>();
  const [invalidSubmit, setInvalidSubmit] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (invalidSubmit) nameRef.current?.focus(); }, [invalidSubmit]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  function update(patch: Partial<typeof initialSettings>) { setDraft(current => ({ ...current, ...patch })); setMessage(''); if (patch.name !== undefined) setNameError(undefined); }
  function reset() { setDraft(saved); setNameError(undefined); setMessage('Draft reset to your last saved settings.'); }

  return <main className="workspace-example">
    <header className="workspace-example__header">
      <div className="workspace-example__identity"><Avatar name="Deepak Studio" /><span>Deepak Studio</span><Badge>Workspace</Badge></div>
      <CommandPalette triggerLabel="Find a setting" title="Workspace commands" placeholder="Search settings and actions…" items={[
        { id: 'general', label: 'Show general settings', description: 'Workspace name and project subscriptions', keywords: ['profile', 'projects'], onSelect: () => setSection('general') },
        { id: 'notifications', label: 'Show notification settings', description: 'Email updates and digest frequency', keywords: ['email', 'alerts'], onSelect: () => setSection('notifications') },
        { id: 'reset', label: 'Reset draft changes', description: 'Restore the last settings saved in this preview', disabled: !dirty, onSelect: reset },
      ]} />
    </header>
    <div className="workspace-example__intro"><h1>Workspace settings</h1><p>Make space for the work that matters. Choose the projects and updates you want to follow.</p></div>
    <form noValidate onSubmit={event => {
      event.preventDefault();
      if (!draft.name.trim()) {
        setNameError('Enter a workspace name.'); setSection('general'); setInvalidSubmit(attempt => attempt + 1); return;
      }
      setSaved(draft); setNameError(undefined); setMessage('Saved in this preview.');
    }}>
      <Tabs label="Settings sections" value={section} onValueChange={setSection} items={[
        { value: 'general', label: 'General', content: <div className="workspace-example__section">
          <div className="workspace-example__section-copy"><h2>Your workspace</h2><p>A familiar name and a focused project list keep your daily work close.</p></div>
          <div className="workspace-example__fields">
            <TextField ref={nameRef} label="Workspace name" name="workspaceName" value={draft.name} onChange={event => update({ name: event.target.value })} required maxLength={80} error={nameError} description="Shown to everyone in this workspace." />
            <MultiSelect label="Projects to follow" name="projects" value={draft.projects} onValueChange={value => update({ projects: value })} options={projects} placeholder="Find a project…" description="Follow only the projects you need. Remove a project to stop its updates." />
          </div>
        </div> },
        { value: 'notifications', label: 'Notifications', content: <div className="workspace-example__section">
          <div className="workspace-example__section-copy"><h2>Stay informed</h2><p>Choose a rhythm that gives you useful updates without interrupting your work.</p></div>
          <div className="workspace-example__fields">
            <Switch label="Email updates" description="Receive a digest for the projects you follow." checked={draft.email} onCheckedChange={email => update({ email })} />
            <RadioGroup label="Digest frequency" value={draft.cadence} onValueChange={cadence => update({ cadence })} disabled={!draft.email} options={[{ value: 'daily', label: 'Daily', description: 'One summary at the end of each day.' }, { value: 'weekly', label: 'Weekly', description: 'A quieter summary every Friday.' }]} />
          </div>
        </div> },
      ]} />
      <footer className="workspace-example__footer">
        <div><p role="status" aria-label="Save status" className="workspace-example__status">{message || (dirty ? 'You have unsaved changes.' : 'All changes saved.')}</p><p className="workspace-example__preview-note">Local example. Changes stay in this preview.</p></div>
        <div className="workspace-example__actions"><Button variant="quiet" disabled={!dirty} onClick={reset}>Reset changes</Button><Button type="submit" disabled={!dirty}>Save changes</Button></div>
      </footer>
    </form>
  </main>;
}
