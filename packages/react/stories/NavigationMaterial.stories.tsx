import { useId, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Popover, RadioGroup } from '../src/index';
import './navigation-material.css';

type NavigationMaterial = 'subtle' | 'expressive' | 'solid';

const finishes = [
  { value: 'subtle', label: 'Subtle' },
  { value: 'expressive', label: 'Expressive' },
  { value: 'solid', label: 'Solid' },
];

function NavigationMaterialExample({ initialMaterial }: { initialMaterial: NavigationMaterial }) {
  const [material, setMaterial] = useState<NavigationMaterial>(initialMaterial);
  const id = useId();
  const schedule = useRef<HTMLElement>(null);
  const focusSchedule = () => schedule.current?.focus();

  return (
    <div className="navigation-material-example">
      <header className="navigation-material-example__header dp-navigation-surface" data-dp-material={material}>
        <a className="navigation-material-example__wordmark" href={`#${id}-projects`}>Serein</a>
        <nav aria-label="Workspace navigation" className="navigation-material-example__links">
          <a href={`#${id}-projects`} aria-current="page">Projects</a>
          <a href={`#${id}-activity`}>Activity</a>
          <a href={`#${id}-team`}>Team</a>
        </nav>
      </header>
      <main className="navigation-material-example__content">
        <h1 id={`${id}-projects`} tabIndex={-1}>Client projects</h1>
        <p>Review current work, due dates, and decisions in one shared workspace.</p>
        <section className="navigation-material-example__controls" aria-labelledby={`${id}-controls-title`}>
          <h2 id={`${id}-controls-title`}>Preview controls</h2>
          <Popover triggerLabel="Appearance" title="Appearance">
            <RadioGroup label="Navigation finish" value={material} onValueChange={(value) => setMaterial(value as NavigationMaterial)} options={finishes} />
            <p className="navigation-material-example__appearance-note">Glass follows your device’s transparency and contrast settings.</p>
          </Popover>
          <Button onClick={focusSchedule}>Review schedule</Button>
        </section>
        <section ref={schedule} tabIndex={-1} aria-labelledby={`${id}-schedule-title`}>
          <h2 id={`${id}-schedule-title`}>Schedule</h2>
          <p>Three project reviews are due this week, with the next decision meeting on Thursday.</p>
        </section>
        <section id={`${id}-activity`} tabIndex={-1} aria-labelledby={`${id}-activity-title`}>
          <h2 id={`${id}-activity-title`}>Activity</h2>
          <p>Maya shared updated discovery notes for the Northline campaign.</p>
        </section>
        <section id={`${id}-team`} tabIndex={-1} aria-labelledby={`${id}-team-title`}>
          <h2 id={`${id}-team-title`}>Team</h2>
          <p>Four collaborators have access to this workspace.</p>
        </section>
      </main>
    </div>
  );
}

const meta = {
  title: 'Foundations/Navigation material',
  component: NavigationMaterialExample,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationMaterialExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = {
  args: { initialMaterial: 'subtle' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Appearance' });
    await userEvent.click(trigger);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Appearance' });
    await userEvent.click(within(dialog).getByRole('radio', { name: 'Expressive' }));
    await expect(canvas.getByRole('banner')).toHaveAttribute('data-dp-material', 'expressive');
    await userEvent.click(within(dialog).getByRole('radio', { name: 'Subtle' }));
    await expect(canvas.getByRole('banner')).toHaveAttribute('data-dp-material', 'subtle');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Expressive: Story = { args: { initialMaterial: 'expressive' } };
export const Solid: Story = { args: { initialMaterial: 'solid' } };
