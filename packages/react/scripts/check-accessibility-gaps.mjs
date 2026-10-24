import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');
const playwright = await import('playwright');
const browserName = process.env.BROWSER ?? process.argv[2] ?? 'chromium';
const supportedBrowsers = ['chromium', 'firefox', 'webkit'];
if (!supportedBrowsers.includes(browserName)) {
  throw new Error(`Unsupported BROWSER=${browserName}. Expected one of: ${supportedBrowsers.join(', ')}`);
}
const playwrightVersion = JSON.parse(await readFile(resolve('node_modules/playwright/package.json'), 'utf8')).version;

const fixture = resolve('.review/accessibility-gaps-fixture');
const output = resolve(`.review/accessibility-gaps/${browserName}`);
await mkdir(fixture, { recursive: true });
await mkdir(output, { recursive: true });

await writeFile(resolve(fixture, 'index.html'), '<div id="root"></div><script type="module" src="/entry.jsx"></script>');
await writeFile(resolve(fixture, 'entry.jsx'), `
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Alert, Button, Combobox, Dialog, Drawer, DropdownMenu, Select, TextField } from '../../dist/index.js';
import '../../dist/styles.css';

function App() {
  const [assignee, setAssignee] = useState('personal');
  const [team, setTeam] = useState('personal');
  const [menuAction, setMenuAction] = useState('none');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Ready.');
  const emailRef = useRef(null);
  const options = [
    { value: 'personal', label: 'Personal' },
    { value: 'restricted', label: 'Restricted', disabled: true },
    { value: 'studio', label: 'Studio' },
  ];
  function submit(event) {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      requestAnimationFrame(() => emailRef.current?.focus());
    }
  }
  return <main className="dp-theme" style={{ minHeight: '100vh', padding: 24, display: 'grid', gap: 24 }}>
    <h1>Accessibility gap fixture</h1>
    <section aria-labelledby="composites-heading" style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <h2 id="composites-heading">Composite widgets</h2>
      <Combobox label="Assignee" value={assignee} onValueChange={setAssignee} options={options} />
      <p data-testid="assignee-value">Assignee value: {assignee}</p>
      <Select label="Team" value={team} onValueChange={setTeam} options={options} />
      <p data-testid="team-value">Team value: {team}</p>
      <DropdownMenu triggerLabel="Record actions" items={[
        { label: 'Edit', onSelect: () => setMenuAction('edit') },
        { label: 'Delete', disabled: true, onSelect: () => setMenuAction('delete') },
        { label: 'Duplicate', onSelect: () => setMenuAction('duplicate') },
      ]} />
      <p data-testid="menu-action">Menu action: {menuAction}</p>
    </section>
    <section aria-labelledby="layers-heading">
      <h2 id="layers-heading">Layered focus</h2>
      <Drawer triggerLabel="Open drawer" title="Filters" description="Choose filters for the view.">
        <div style={{ display: 'grid', gap: 16 }}>
          <Button variant="secondary">First drawer action</Button>
          <Dialog triggerLabel="Open nested review" title="Nested review" description="Review without leaving the drawer.">
            <Button variant="secondary">Nested dialog action</Button>
          </Dialog>
          <Button variant="secondary">Last drawer action</Button>
        </div>
      </Drawer>
    </section>
    <section aria-labelledby="feedback-heading" style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <h2 id="feedback-heading">Errors and status</h2>
      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 12 }}>
        <TextField ref={emailRef} label="Contact email" value={email} error={error || undefined}
          onChange={event => { const next = event.target.value; setEmail(next); if (next.includes('@')) setError(''); }} />
        <Button type="submit">Validate email</Button>
      </form>
      <Button variant="secondary" onClick={() => setStatus(value => value === 'Ready.' ? 'Saved.' : 'Ready.')}>Change status</Button>
      <Alert title="Update status" live="polite">{status}</Alert>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
`);

const server = await createServer({
  root: fixture,
  configFile: false,
  cacheDir: resolve('.review/accessibility-gaps-vite-cache'),
  server: { host: '127.0.0.1', port: 0, strictPort: false, fs: { allow: [resolve('.')] } },
});
await server.listen();
const base = server.resolvedUrls?.local[0];
if (!base) throw new Error('Vite did not expose a local fixture URL.');

const browser = await playwright[browserName].launch();
const browserVersion = browser.version();
const results = [];
const failures = [];

async function record(name, action) {
  try {
    const detail = await action();
    results.push({ name, status: 'pass', detail });
    console.log(`PASS ${name}: ${detail}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({ name, message });
    console.error(`FAIL ${name}: ${message}`);
  }
}

async function expectFocus(page, locator) {
  const element = await locator.elementHandle();
  await page.waitForFunction(target => target === document.activeElement, element);
}

try {
  const page = await browser.newPage({ viewport: { width: 960, height: 900 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(8000);
  await page.goto(base);
  await page.getByRole('heading', { name: 'Accessibility gap fixture' }).waitFor();

  await record('disabled combobox option', async () => {
    const input = page.getByRole('combobox', { name: 'Assignee' });
    await input.click();
    await input.fill('Restricted');
    const option = page.getByRole('option', { name: 'Restricted', exact: true });
    await option.waitFor();
    assert.equal(await option.getAttribute('aria-disabled'), 'true', 'Disabled option is not exposed as aria-disabled');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    assert.equal(await page.getByTestId('assignee-value').textContent(), 'Assignee value: personal', 'Disabled option changed the combobox value');
    return 'disabled state is exposed and keyboard selection is rejected';
  });

  await page.reload();
  await page.getByRole('heading', { name: 'Accessibility gap fixture' }).waitFor();
  await record('select and menu disabled keyboard navigation', async () => {
    const select = page.getByRole('combobox', { name: 'Team' });
    await select.focus();
    await page.keyboard.press('ArrowDown');
    const listbox = page.getByRole('listbox', { name: 'Team' });
    await listbox.waitFor();
    const personal = page.getByRole('option', { name: 'Personal', exact: true });
    const restricted = page.getByRole('option', { name: 'Restricted', exact: true });
    const studio = page.getByRole('option', { name: 'Studio', exact: true });
    await expectFocus(page, personal);
    await page.keyboard.press('ArrowDown');
    await expectFocus(page, restricted);
    assert.equal(await restricted.getAttribute('aria-disabled'), 'true');
    for (const key of ['Enter', 'Space']) {
      await page.keyboard.press(key);
      assert.equal(await page.getByTestId('team-value').textContent(), 'Team value: personal', `${key} selected a disabled option`);
      assert.ok(await listbox.isVisible(), `${key} dismissed the listbox from a disabled option`);
      await expectFocus(page, restricted);
    }
    await page.keyboard.press('ArrowDown');
    await expectFocus(page, studio);
    await page.keyboard.press('ArrowUp');
    await expectFocus(page, restricted);
    await page.keyboard.press('Home');
    await expectFocus(page, personal);
    await page.keyboard.press('End');
    await expectFocus(page, studio);
    await page.keyboard.press('Enter');
    assert.equal(await page.getByTestId('team-value').textContent(), 'Team value: studio');
    await listbox.waitFor({ state: 'hidden' });
    await expectFocus(page, select);
    await page.keyboard.press('ArrowDown');
    await listbox.waitFor();
    await page.keyboard.press('Escape');
    await listbox.waitFor({ state: 'hidden' });
    await expectFocus(page, select);

    const menu = page.getByRole('button', { name: 'Record actions' });
    await menu.focus();
    await page.keyboard.press('ArrowDown');
    const popup = page.getByRole('menu');
    await popup.waitFor();
    const edit = page.getByRole('menuitem', { name: 'Edit', exact: true });
    const disabled = page.getByRole('menuitem', { name: 'Delete' });
    const duplicate = page.getByRole('menuitem', { name: 'Duplicate' });
    await expectFocus(page, edit);
    await page.keyboard.press('ArrowDown');
    await expectFocus(page, disabled);
    assert.equal(await disabled.getAttribute('aria-disabled'), 'true');
    assert.equal(await disabled.isEnabled(), false);
    for (const key of ['Enter', 'Space']) {
      await page.keyboard.press(key);
      assert.equal(await page.getByTestId('menu-action').textContent(), 'Menu action: none', `${key} activated a disabled menu item`);
      assert.ok(await popup.isVisible(), `${key} dismissed the menu from a disabled item`);
      await expectFocus(page, disabled);
    }
    await page.keyboard.press('ArrowDown');
    await expectFocus(page, duplicate);
    await page.keyboard.press('ArrowUp');
    await expectFocus(page, disabled);
    await page.keyboard.press('Home');
    await expectFocus(page, edit);
    await page.keyboard.press('End');
    await expectFocus(page, duplicate);
    await page.keyboard.press('Enter');
    assert.equal(await page.getByTestId('menu-action').textContent(), 'Menu action: duplicate');
    await popup.waitFor({ state: 'hidden' });
    await expectFocus(page, menu);
    await page.keyboard.press('ArrowDown');
    await popup.waitFor();
    await page.keyboard.press('Escape');
    await popup.waitFor({ state: 'hidden' });
    await expectFocus(page, menu);
    return 'arrows reach disabled items in both directions; Enter/Space reject disabled activation; Home/End, enabled activation and Escape restore the expected focus';
  });

  await page.reload();
  await page.getByRole('heading', { name: 'Accessibility gap fixture' }).waitFor();
  await record('nested dialog and drawer focus stack', async () => {
    const drawerTrigger = page.getByRole('button', { name: 'Open drawer' });
    const drawerTriggerHandle = await drawerTrigger.elementHandle();
    await drawerTrigger.click();
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await drawer.waitFor();
    const drawerHandle = await drawer.elementHandle();
    await page.waitForFunction(element => element?.contains(document.activeElement), drawerHandle);
    const nestedTrigger = drawer.getByRole('button', { name: 'Open nested review' });
    const nestedTriggerHandle = await nestedTrigger.elementHandle();
    await nestedTrigger.click();
    const nested = page.getByRole('dialog', { name: 'Nested review' });
    await nested.waitFor();
    const nestedHandle = await nested.elementHandle();
    await page.waitForFunction(element => element?.contains(document.activeElement), nestedHandle);
    await page.keyboard.press('Escape');
    await nested.waitFor({ state: 'hidden' });
    assert.ok(await drawer.isVisible(), 'Escape closed the parent drawer with the nested dialog');
    await page.waitForFunction(element => element === document.activeElement, nestedTriggerHandle);
    await page.keyboard.press('Escape');
    await drawer.waitFor({ state: 'hidden' });
    await page.waitForFunction(element => element === document.activeElement, drawerTriggerHandle);
    return 'each Escape closes one layer and restores focus to the corresponding trigger';
  });

  await page.reload();
  await page.getByRole('heading', { name: 'Accessibility gap fixture' }).waitFor();
  await record('error recovery and live status semantics', async () => {
    const email = page.getByRole('textbox', { name: 'Contact email' });
    await page.getByRole('button', { name: 'Validate email' }).click();
    const error = page.getByRole('alert', { name: '' });
    await error.waitFor();
    assert.equal(await error.textContent(), 'Enter a valid email address.');
    assert.equal(await email.getAttribute('aria-invalid'), 'true');
    assert.ok(await email.evaluate(element => element === document.activeElement), 'Invalid field did not receive focus');
    await email.fill('reviewer@example.com');
    assert.equal(await page.getByText('Enter a valid email address.').count(), 0, 'Stale error remained after correction');
    assert.equal(await email.getAttribute('aria-invalid'), null, 'Corrected field remained invalid');
    const status = page.getByRole('status', { name: '' });
    const statusNode = await status.elementHandle();
    await page.getByRole('button', { name: 'Change status' }).click();
    assert.ok((await status.textContent())?.includes('Saved.'));
    assert.ok(await status.evaluate((element, original) => element === original, statusNode), 'Status node was replaced instead of updated');
    return 'validation clears after correction and a stable polite status region updates';
  });

  await page.setViewportSize({ width: 320, height: 720 });
  await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
  await record('text spacing and target size', async () => {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page overflows horizontally with WCAG text spacing at 320 CSS px');
    const targets = await page.locator('button:visible, [role="combobox"]:visible').evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      return { name: element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName, width: rect.width, height: rect.height };
    }));
    const undersized = targets.filter(target => target.width < 24 || target.height < 24);
    assert.deepEqual(undersized, [], `Targets smaller than 24 CSS px: ${JSON.stringify(undersized)}`);
    await page.screenshot({ path: resolve(output, 'text-spacing-320.png'), fullPage: true, animations: 'disabled' });
    return `${targets.length} rendered button/combobox targets meet 24 by 24 CSS px; no page overflow`;
  });
  await page.close();

  const forced = await browser.newPage({ viewport: { width: 390, height: 760 }, forcedColors: 'active', reducedMotion: 'reduce' });
  await forced.goto(base);
  await forced.getByRole('heading', { name: 'Accessibility gap fixture' }).waitFor();
  await record('forced-colour focus visibility', async () => {
    const button = forced.getByRole('button', { name: 'Validate email' });
    await button.focus();
    const focus = await button.evaluate(element => ({ outlineStyle: getComputedStyle(element).outlineStyle, outlineWidth: getComputedStyle(element).outlineWidth, outlineColor: getComputedStyle(element).outlineColor }));
    assert.equal(focus.outlineStyle, 'solid');
    assert.notEqual(focus.outlineWidth, '0px');
    const systemText = await forced.evaluate(() => {
      const probe = document.createElement('button');
      probe.style.color = 'ButtonText';
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    });
    assert.equal(await button.evaluate(element => getComputedStyle(element).color), systemText);
    await forced.screenshot({ path: resolve(output, 'forced-colours.png'), fullPage: true, animations: 'disabled' });
    return `focused control has ${focus.outlineWidth} ${focus.outlineStyle} system-colour outline`;
  });
  await forced.close();
} finally {
  await writeFile(resolve(output, 'results.json'), JSON.stringify({
    browser: browserName,
    browserVersion,
    nodeVersion: process.version,
    playwrightVersion,
    results,
    failures,
  }, null, 2));
  await browser.close();
  await server.close();
}

assert.deepEqual(failures, []);
