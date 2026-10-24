import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIcon } from '../src/index';
import { useGlobals } from 'storybook/preview-api';
import { expect, within } from 'storybook/test';
import { StatusIconExample } from './StatusIconExample';

const meta = {
  title: 'Components/StatusIcon',
  component: StatusIcon,
  tags: ['autodocs'],
  args: { kind: 'send', state: 'idle', size: 32 },
  parameters: { docs: { description: { component: 'Decorative status icons must be paired with visible text. Idle is still; pending has a distinct glyph and optional motion. Preview animation explicitly overrides reduced motion in Storybook only.' } } },
  render: function Render(args) {
    const [globals, updateGlobals] = useGlobals();
    return <StatusIconExample {...args} motion={globals.motion} onMotionChange={motion => updateGlobals({ motion })} />;
  },
  argTypes: { kind: { control: 'select', options: ['send', 'payment', 'loading'] }, state: { control: 'select', options: ['idle', 'pending', 'success', 'error'] }, size: { control: { type: 'number', min: 12, max: 48 } } },
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Idle: Story = { play: async ({ canvasElement }) => {
  await expect(within(canvasElement).getByText('Message ready')).toBeVisible();
  await expect(canvasElement.querySelector('svg.dp-status-icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(getComputedStyle(canvasElement.querySelector('svg.dp-status-icon')!).animationName).toBe('none');
} };
export const Pending: Story = { args: { state: 'pending' }, play: async ({ canvasElement, globals }) => {
  await expect(within(canvasElement).getByText('Message in progress')).toBeVisible();
  await expect(canvasElement.querySelector('svg.dp-status-icon')).toHaveAttribute('aria-hidden', 'true');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches && globals.motion !== 'full';
  await expect(getComputedStyle(canvasElement.querySelector('svg.dp-status-icon')!).animationName).toBe(reduced ? 'none' : 'dp-status-icon-send');
} };
export const Success: Story = { args: { state: 'success' } };
export const Error: Story = { args: { state: 'error' } };
export const Payment: Story = { args: { kind: 'payment' } };
export const Loading: Story = { args: { kind: 'loading', state: 'pending' } };
