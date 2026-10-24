import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RainChart } from '../src/index';

// Daily spend, 1 to 24 October (rupees); 25 to 31 October have not happened yet.
const spend = [1240, 860, 2150, 480, 3920, 1175, 640, 2890, 1320, 760, 4410, 980, 1560, 2240, 520, 1890, 3050, 710, 1430, 2680, 950, 1720, 2060, 3320];
const data = [...spend, ...Array.from({ length: 7 }, () => null)];

const meta = {
  title: 'Components/RainChart',
  component: RainChart,
  tags: ['autodocs'],
  args: { data, max: 6000, xLabels: ['1 Oct', '8', '15', '22', '31'], height: 148, showAverage: true, label: 'Daily spend, 1 to 24 October. Average ₹1,725 a day; today ₹3,320.' },
  decorators: [Story => <div style={{ maxWidth: 640 }}><Story /></div>],
  parameters: { docs: { description: { component: 'Daily values drawn as precipitation: 3px ink bars for the past, one 5px signal bar for the highlighted period, 2px stubs for periods still to come and a dashed average line. The chart is a single image, so the label must summarise what it shows.' } } },
} satisfies Meta<typeof RainChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MonthToDate: Story = { play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('img')).toHaveAccessibleName(/Daily spend/); } };
export const Compact: Story = { args: { height: 64, xLabels: undefined, showAverage: false } };
export const HighlightEarlierDay: Story = { args: { highlight: 10 } };
export const AutomaticScale: Story = { args: { max: undefined } };
