'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Alert, Button, Card, Select, Switch, TextField } from '@serein-ui/react';

type SaveState =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; message: string };

type SettingsFormProps = {
  initialName: string;
  initialTeam: string;
  initialSummary: boolean;
};

export function SettingsForm({ initialName, initialTeam, initialSummary }: SettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [team, setTeam] = useState(initialTeam);
  const [summary, setSummary] = useState(initialSummary);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [nameError, setNameError] = useState('');
  const [saveState, setSaveState] = useState<SaveState>({ kind: 'idle' });
  const requestPending = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const pending = saveState.kind === 'pending';

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.dpTheme = nextTheme;
    setTheme(nextTheme);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestPending.current) return;

    if (!name.trim()) {
      setNameError('Enter a workspace name.');
      setSaveState({ kind: 'idle' });
      nameInput.current?.focus();
      return;
    }

    setNameError('');
    requestPending.current = true;
    setSaveState({ kind: 'pending' });

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), team, summary }),
      });
      const result = (await response.json()) as { attempt: number; message?: string };
      if (!response.ok) {
        setSaveState({
          kind: 'error',
          message: result.message ?? `Attempt ${result.attempt} failed.`,
        });
        return;
      }
      setSaveState({ kind: 'success', message: `Saved on attempt ${result.attempt}.` });
    } catch {
      setSaveState({ kind: 'error', message: 'The local save route was unavailable.' });
    } finally {
      requestPending.current = false;
    }
  }

  return (
    <Card className="settings-card">
      <div className="card-heading">
        <div>
          <h2>Workspace details</h2>
          <p>The first valid save fails so recovery can be verified.</p>
        </div>
        <Button
          type="button"
          variant="quiet"
          aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? 'Dark theme' : 'Light theme'}
        </Button>
      </div>

      <form className="settings-form" onSubmit={save} noValidate>
        <TextField
          label="Workspace name"
          description="Used in the local success response only."
          error={nameError || undefined}
          ref={nameInput}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (nameError) setNameError('');
          }}
          autoComplete="organization"
          disabled={pending}
          required
        />
        <Select
          label="Team"
          description="Choose the group that owns the workspace."
          value={team}
          onValueChange={setTeam}
          disabled={pending}
          options={[
            { value: 'design', label: 'Design' },
            { value: 'engineering', label: 'Engineering' },
            { value: 'operations', label: 'Operations' },
          ]}
        />
        <Switch
          label="Daily summary"
          description="Include a short activity digest."
          checked={summary}
          onCheckedChange={setSummary}
          disabled={pending}
        />

        {saveState.kind === 'error' && (
          <Alert title="Save failed" tone="error" live="assertive">
            {saveState.message} Your entries are still here; try again.
          </Alert>
        )}
        {saveState.kind === 'success' && (
          <Alert title="Workspace saved" tone="success" live="polite">
            {saveState.message}
          </Alert>
        )}

        <Button type="submit" loading={pending}>
          Save workspace
        </Button>
      </form>
    </Card>
  );
}
