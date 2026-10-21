import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, TextField } from '@serein-ui/react';
import { declaration, entries, families, specimenSource, specimens, type ComponentName } from './data';
import './catalogue.css';

const asset = (path: string) => `${import.meta.env.BASE_URL}catalogue-assets/${path}`;
function readSelection(): ComponentName {
  const requested = new URLSearchParams(location.search).get('component');
  return entries.find(entry => entry.name === requested)?.name ?? 'Button';
}
function CodeBlock({ text, label }: { text: string; label: string }) {
  const [message, setMessage] = useState('');
  const code = useRef<HTMLPreElement>(null);
  useEffect(() => setMessage(''), [text]);
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setMessage('Copied.');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      if (code.current && selection) {
        range.selectNodeContents(code.current);
        selection.removeAllRanges(); selection.addRange(range); code.current.focus();
      }
      setMessage('Automatic copy is unavailable. Text selected; press Ctrl+C or Command+C to copy.');
    }
  }
  return <div className="catalogue-code"><div className="catalogue-code-toolbar"><span>{label}</span><Button variant="quiet" onClick={copy}>Copy {label.toLowerCase()}</Button></div><pre tabIndex={0} ref={code} aria-label={label}><code>{text}</code></pre><p role="status">{message}</p></div>;
}

export default function Catalogue() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('All components');
  const [selected, setSelected] = useState<ComponentName>(readSelection);
  const [dark, setDark] = useState(() => document.documentElement.dataset.dpTheme === 'dark');
  useEffect(() => { document.documentElement.dataset.dpTheme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => {
    const sync = () => setSelected(readSelection());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  useEffect(() => { document.title = selected + " · Catalogue · Serein"; }, [selected]);
  const entry = entries.find(item => item.name === selected)!;
  const Preview = specimens[selected];
  const [declarationFile, api] = declaration(selected);
  const visible = entries.filter(item => (family === 'All components' || item.family === family) && `${item.name} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  function choose(name: ComponentName) {
    setSelected(name);
    const url = new URL(location.href); url.searchParams.set('view', 'catalogue'); url.searchParams.set('component', name);
    history.pushState(null, '', url);
    if (window.matchMedia('(max-width: 650px)').matches) requestAnimationFrame(() => document.getElementById('catalogue-content')?.focus());
  }
  return <div className="catalogue-shell">
    <a className="skip-link" href="#catalogue-content">Skip to component</a>
    <header className="catalogue-header"><a className="wordmark" href="?view=catalogue">Serein</a><nav aria-label="Reference pages"><a href="?view=serein">Design studio</a><a href="?view=workspace">Workspace</a><a href="?view=composition">Composition lab</a></nav><Button variant="quiet" onClick={() => setDark(!dark)}>{dark ? 'Use light theme' : 'Use dark theme'}</Button></header>
    <div className="catalogue-intro"><h1>Component catalogue</h1><p>Practical React primitives, shaped by Serein. Explore a component, try its behavior, and take the typed example into your app.</p><div className="catalogue-resource-links"><a href="#installation">Install locally</a><a href="#foundations">Foundations</a><a href={asset('docs/FOUNDATIONS.md')}>Foundation reference</a><a href={asset('ai/llms-full.txt')}>AI reference</a><a href={asset('docs/ACCESSIBILITY.md')}>Accessibility notes</a></div></div>
    <div className="catalogue-layout">
      <aside className="catalogue-sidebar" aria-label="Component browser">
        <TextField label="Search components" placeholder="Name or purpose" value={query} onChange={event => setQuery(event.target.value)} />
        <label className="catalogue-filter">Component category<select value={family} onChange={event => setFamily(event.target.value)}>{['All components', ...families].map(name => <option key={name}>{name}</option>)}</select></label>
        <p className="catalogue-count" role="status">{visible.length} of {entries.length} components</p>
        {visible.length ? <nav className="catalogue-component-list" aria-label="Components">{families.map(group => {
          const items = visible.filter(item => item.family === group);
          return items.length ? <section key={group}><h2>{group}</h2>{items.map(item => <a key={item.name} href={`?view=catalogue&component=${item.name}`} aria-current={selected === item.name ? 'page' : undefined} onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); choose(item.name); } }}>{item.name}</a>)}</section> : null;
        })}</nav> : <EmptyState title="No components found" description="Try a broader name or clear the category." action={<Button onClick={() => { setQuery(''); setFamily('All components'); }}>Clear filters</Button>} />}
      </aside>
      <main id="catalogue-content" className="catalogue-content" tabIndex={-1}>
        <section aria-labelledby="component-title"><div className="catalogue-component-heading"><div><h2 id="component-title">{selected}</h2><p>{entry.description}</p></div><a href={`?view=catalogue&component=${selected}`}>Permalink</a></div>
          <div className="catalogue-preview" aria-label={`${selected} live preview`} role="region"><div key={selected} className="catalogue-specimen"><Preview /></div></div>
          <p className="catalogue-note">Live installed-package specimen. Changes are temporary; selecting another component resets the example.</p>
          <h3>Usage</h3><p>{entry.description} Start with the example below, supply meaningful labels, and keep application data and side effects in your app.</p>
          <CodeBlock label="Example" text={specimenSource(selected)} />
          <details className="catalogue-api"><summary>API types and implementation</summary><p>The full declaration module includes related types used by this component.</p><div className="catalogue-resource-links"><a href={asset(`api/${declarationFile}`)}>Download API types</a><a href={asset(`source/${declarationFile.replace('.d.ts', '.tsx')}`)}>Read implementation source</a><a href={asset('ai/contract.json')}>Machine-readable contract</a></div><CodeBlock label="API" text={api} /></details>
        </section>
        <section id="installation" className="catalogue-guide"><h2>Use it in your project</h2><p>This package is unpublished. Build a local tarball from the repository, then install that file into a React app.</p><CodeBlock label="Installation" text={'git clone https://github.com/deepak-hp/serein-ui.git\ncd serein-ui/trial\nnpm ci\nnpm run build\nnpm pack\n# In your React application:\nnpm install /absolute/path/to/serein-ui/trial/serein-ui-react-0.1.0-beta.1.tgz'} /><p>Use Node.js 24 and the React peer versions in the package manifest. Import the stylesheet and Plus Jakarta Sans once. Put <code>data-dp-theme="light"</code> on the document element and <code>class="dp-theme"</code> on the body so portalled overlays inherit the theme.</p><CodeBlock label="Setup" text={'import "@fontsource-variable/plus-jakarta-sans";\nimport "@serein-ui/react/styles.css";\nimport { Button } from "@serein-ui/react";\n\ndocument.documentElement.dataset.dpTheme = "light";\ndocument.body.classList.add("dp-theme");\n\n// In your React component, supply your action:\n<Button onClick={onContinue}>Continue</Button>'} /></section>
        <section id="foundations" className="catalogue-guide"><h2>Serein foundations</h2><p>Orange actions with dark text. White and near-black canvases. Plus Jakarta Sans. Green reserved for meaningful success states.</p><dl className="catalogue-tokens"><div><dt>Primary action</dt><dd><span className="catalogue-swatch" style={{ background: 'var(--dp-orange)' }} />--dp-orange · {dark ? '#FF803E' : '#FF681F'}</dd></div><div><dt>Canvas &amp; text</dt><dd>--dp-canvas / --dp-text</dd></div><div><dt>Quiet surfaces</dt><dd>--dp-surface / --dp-divider</dd></div><div><dt>Visible focus</dt><dd>--dp-focus</dd></div></dl><p>Set <code>data-dp-theme="dark"</code> on the document element for dark mode. Preserve visible focus and meaningful labels. WCAG 2.2 AA is a target; automated checks do not certify conformance.</p><div className="catalogue-resource-links"><a href={asset('docs/FOUNDATIONS.md')}>Read foundation reference</a><a href={asset('tokens.css')}>All theme tokens</a><a href={asset('ai/AGENTS.md')}>Agent instructions</a><a href={asset('ai/COMPOSITION.md')}>Composition recipes</a></div></section>
      <section className="catalogue-guide"><h2>Explore complete examples</h2><p>Local demonstrations for composing these primitives into everyday tasks. Data stays in your browser.</p><div className="catalogue-resource-links"><a href="?view=invoices">Invoices</a><a href="?view=settings">Settings</a><a href="?view=onboarding">Onboarding</a><a href={asset('ai/examples/README.md')}>Workflow source recipes</a></div></section></main>
    </div>
  </div>;
}
