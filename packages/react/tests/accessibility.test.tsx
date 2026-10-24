import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import { Dialog, Select, TextField } from '../src/components';
import { Checkbox, RadioGroup, Switch } from '../src/selection';
import { Tabs } from '../src/tabs';

test('TextField keeps guidance and exposes validation feedback to assistive technology', () => {
  render(
    <TextField
      label="Work email"
      description="Use your company address."
      error="Enter a valid work email."
      required
    />,
  );

  const input = screen.getByRole('textbox', { name: 'Work email' });

  expect(input).toBeRequired();
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Use your company address. Enter a valid work email.');
  expect(input).toHaveAttribute('aria-errormessage');
  expect(document.getElementById(input.getAttribute('aria-errormessage')!)).toHaveTextContent('Enter a valid work email.');
});

test('select and dialog expose their popup content', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Select label="Workspace" value="personal" onValueChange={() => {}} options={[{ value: 'personal', label: 'Personal' }]} />
      <Dialog triggerLabel="Open review" title="Review" description="Check your settings."><p>Content</p></Dialog>
    </>,
  );

  await user.click(screen.getByRole('combobox', { name: 'Workspace' }));
  expect(await screen.findByRole('listbox', { name: 'Workspace' })).toBeVisible();

  await user.click(screen.getByRole('button', { name: 'Open review' }));
  expect(await screen.findByRole('dialog', { name: 'Review' })).toBeVisible();
});

test('core controls have no automated WCAG 2.2 AA structural violations', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TextField label="Work email" description="Use your company address." required />
      <Select label="Workspace" value="personal" onValueChange={() => {}} options={[{ value: 'personal', label: 'Personal' }]} />
      <Checkbox label="Session reminders" checked={false} onCheckedChange={() => {}} />
      <Switch label="Quiet mode" checked={false} onCheckedChange={() => {}} />
      <RadioGroup label="Plan" value="starter" onValueChange={() => {}} options={[{ value: 'starter', label: 'Starter' }]} />
      <Tabs label="Session details" value="overview" onValueChange={() => {}} items={[{ value: 'overview', label: 'Overview', content: 'Overview content' }]} />
      <Dialog triggerLabel="Open review" title="Review" description="Check your settings."><p>Content</p></Dialog>
    </>,
  );

  const axeOptions = {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: { 'color-contrast': { enabled: false } },
  } satisfies axe.RunOptions;

  const pageResults = await axe.run(document.body, axeOptions);
  expect(pageResults.violations).toEqual([]);

  await user.click(screen.getByRole('button', { name: 'Open review' }));
  const dialogResults = await axe.run(document.body, axeOptions);
  expect(dialogResults.violations).toEqual([]);
});

function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const channels = hex.match(/[\da-f]{2}/gi)!.map(channel => Number.parseInt(channel, 16) / 255);
    const [red, green, blue] = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// Serein colours come from @serein-ui/tokens; check the pairs the components rely on.
function themeTokens(theme: 'light' | 'dark') {
  const { themes } = JSON.parse(readFileSync(require.resolve('@serein-ui/tokens/json'), 'utf8'));
  return Object.fromEntries(Object.entries(themes[theme].color as Record<string, string>).map(([name, value]) => [`--sr-color-${name}`, value]));
}

test('light and dark tokens meet enabled control text and boundary contrast thresholds', () => {
  for (const [themeName, tokens] of Object.entries({ light: themeTokens('light'), dark: themeTokens('dark') })) {
    for (const foreground of ['--sr-color-ink', '--sr-color-ink-muted', '--sr-color-signal-ink', '--sr-color-danger', '--sr-color-success']) {
      for (const background of ['--sr-color-surface', '--sr-color-surface-raised']) {
        expect(contrastRatio(tokens[foreground], tokens[background]), `${themeName}: ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
      }
    }

    for (const background of ['--sr-color-signal', '--sr-color-signal-hover', '--sr-color-signal-pressed']) {
      expect(contrastRatio(tokens['--sr-color-on-signal'], tokens[background]), `${themeName}: --sr-color-on-signal on ${background}`).toBeGreaterThanOrEqual(4.5);
    }

    for (const background of ['--sr-color-surface', '--sr-color-surface-raised']) {
      expect(contrastRatio(tokens['--sr-color-line-strong'], tokens[background]), `${themeName}: enabled control boundary on ${background}`).toBeGreaterThanOrEqual(3);
    }
  }
});
