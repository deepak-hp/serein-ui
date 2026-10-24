import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '@serein-ui/react';
import './workflows.css';
export default function Shell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const [dark, setDark] = useState(() => document.documentElement.dataset.dpTheme === 'dark');
  useEffect(() => { document.documentElement.dataset.dpTheme = dark ? 'dark' : 'light'; document.title = `${title} · Serein`; }, [dark, title]);
  return <div className="workflow"><a className="skip-link" href="#workflow-main">Skip to content</a><header className="workflow-header"><a className="wordmark" href="?view=catalogue">Serein</a><a href="?view=catalogue">Back to catalogue</a><Button variant="quiet" onClick={() => setDark(!dark)}>{dark ? 'Use light theme' : 'Use dark theme'}</Button></header><main id="workflow-main" tabIndex={-1}><header className="workflow-intro"><h1>{title}</h1><p>{description}</p></header>{children}</main><footer className="workflow-footer">Local demonstration · No accounts, payments or email delivery.</footer></div>;
}
export function Recovery({ onRecover }: { onRecover: () => void }) { return <div className="workflow-notice" role="alert"><p>Saved data could not be read. It may be damaged, from another version, or browser storage may be unavailable. Existing data has not been changed.</p><Button variant="secondary" onClick={onRecover}>Allow replacement on next save</Button><p>This permits the next successful save to replace the saved record with the values shown.</p></div>; }
export function focusId(id: string) { requestAnimationFrame(() => document.getElementById(id)?.focus()); }
