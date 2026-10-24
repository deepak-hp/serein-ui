import { useRef, useState, type FormEvent } from 'react';
import { Alert, Button, TextField } from '@serein-ui/react';
import { readTheme, saveTheme } from './theme';

export default function App() {
  const [theme, setTheme] = useState(readTheme);
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter a workspace name.');
      nameInput.current?.focus();
      return;
    }
    setError(undefined);
    setPreview(name.trim());
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="app-header">
      <span className="app-name">Serein</span>
      <Button variant="quiet" onClick={() => {
        const next = theme === 'light' ? 'dark' : 'light';
        saveTheme(next);
        setTheme(next);
      }}>{theme === 'light' ? 'Use dark theme' : 'Use light theme'}</Button>
    </header>
    <main id="main" tabIndex={-1}>
      <h1>Your next app</h1>
      <p className="intro">A small starting point. Your colours, your components, ready to make your own.</p>
      <section aria-labelledby="workspace-title">
        <h2 id="workspace-title">Workspace details</h2>
        <form onSubmit={submit} noValidate>
          <TextField ref={nameInput} label="Workspace name" value={name} required error={error}
            description="Try a name to preview this local example."
            onChange={event => { setName(event.target.value); setError(undefined); setPreview(''); }} />
          <Button type="submit">Preview workspace</Button>
        </form>
        {preview && <Alert title="Preview ready" live="polite">{preview} is ready to make your own.</Alert>}
        <p className="note">This preview stays on this page. It doesn’t create an account or save workspace data.</p>
      </section>
    </main>
  </>;
}
