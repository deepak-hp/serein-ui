import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Drizzle, Gauge, Keypad, Meter, RainChart, Readout, Tape, type KeypadKey } from '../src/measurement';

test('Readout reads as the full formatted amount in lakh grouping', () => {
  render(<Readout value={482315.4} fraction="always" />);
  expect(screen.getByText('₹4,82,315.40')).toBeInTheDocument();
});
test('Readout shows a true minus sign, optional plus, and hides fractions on request', () => {
  const { rerender } = render(<Readout value={-2400} size="l" />);
  expect(screen.getByText('−₹2,400')).toBeInTheDocument();
  rerender(<Readout value={2400} sign="always" />);
  expect(screen.getByText('+₹2,400')).toBeInTheDocument();
  rerender(<Readout value={39776.5} fraction="never" className="extra" />);
  expect(screen.getByText('₹39,777').closest('.extra')).not.toBeNull();
});
test('Readout honours currency and locale', () => {
  render(<Readout value={1234.5} currency="USD" locale="en-US" size="m" fraction="always" />);
  expect(screen.getByText('$1,234.50')).toBeInTheDocument();
});

test('Tape is decorative, positions the strip by value and labels the scale in compact form', () => {
  const { container } = render(<Tape value={2400} max={100000} className="tape" />);
  const root = container.firstElementChild as HTMLElement;
  expect(root).toHaveAttribute('aria-hidden', 'true');
  expect(root).toHaveClass('tape');
  const strip = root.firstElementChild as HTMLElement;
  expect(strip.style.getPropertyValue('--sr-tape-n')).toBe('24');
  expect(strip.style.getPropertyValue('--sr-tape-max')).toBe('1000');
  const labels = [...strip.querySelectorAll('span')].map(span => span.textContent).filter(Boolean);
  expect(labels).toHaveLength(21);
  expect(labels[0]).toBe('0');
  expect(labels[1]).toBe('5k');
  expect(labels[2]).toBe('10k');
  expect(labels.at(-1)).toBe('1L');
});
test('Tape stops travelling beyond its scale', () => {
  const { container } = render(<Tape value={9_000_000} max={100000} />);
  expect((container.firstElementChild!.firstElementChild as HTMLElement).style.getPropertyValue('--sr-tape-n')).toBe('1100');
});

test('Gauge exposes meter semantics with the limit as its upper bound', () => {
  render(<Gauge value={39776} max={60000} limit={55000} label="October budget" />);
  const meter = screen.getByRole('meter', { name: 'October budget' });
  expect(meter).toHaveAttribute('aria-valuemin', '0');
  expect(meter).toHaveAttribute('aria-valuemax', '55000');
  expect(meter).toHaveAttribute('aria-valuenow', '39776');
  expect(meter).toHaveAttribute('aria-valuetext', '₹39,776 of ₹55,000');
  const svg = meter.querySelector('svg')!;
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg).toHaveAttribute('height', '260');
  expect([...svg.querySelectorAll('text')].map(text => text.textContent)).toEqual(['0', '10k', '20k', '30k', '40k', '50k', '60k', '55k']);
});
test('Gauge uses the scale maximum without a limit and accepts custom unit and formatters', () => {
  render(<Gauge value={30} max={100} unit={10} label="Storage" formatTick={v => `${v}%`} formatValue={v => `${v} GB`} />);
  const meter = screen.getByRole('meter', { name: 'Storage' });
  expect(meter).toHaveAttribute('aria-valuemax', '100');
  expect(meter).toHaveAttribute('aria-valuetext', '30 GB of 100 GB');
  expect(meter.querySelectorAll('text')).toHaveLength(2);
  expect(meter.querySelector('text')).toHaveTextContent('0%');
});
test('Meter shares the Gauge semantics and labels its limit marker', () => {
  render(<Meter value={39776} max={60000} limit={55000} label="October budget" />);
  const meter = screen.getByRole('meter', { name: 'October budget' });
  expect(meter).toHaveAttribute('aria-valuenow', '39776');
  expect(meter).toHaveAttribute('aria-valuemax', '55000');
  expect(meter).toHaveAttribute('aria-valuetext', '₹39,776 of ₹55,000');
  expect(screen.getByText('55k').style.left).toBe('91.667%');
});

test('RainChart is a labelled image with a highlighted bar, future stubs and an average line', () => {
  const { container } = render(<RainChart data={[1200, 3000, 1800, null, null]} max={3000} xLabels={['1 Oct', '3']} label="Daily spend, 1 to 3 October" />);
  const chart = screen.getByRole('img', { name: 'Daily spend, 1 to 3 October' });
  const bars = [...chart.querySelectorAll('i')];
  expect(bars).toHaveLength(5);
  expect(bars.filter(bar => bar.hasAttribute('data-highlight'))).toEqual([bars[2]]);
  expect(bars.filter(bar => bar.hasAttribute('data-future'))).toEqual([bars[3], bars[4]]);
  expect(bars[1].style.height).toBe('100%');
  expect(bars[2].style.animationDelay).toBe('28ms');
  expect(container.querySelector('div[style*="bottom: 66.667%"]')).not.toBeNull();
  expect(screen.getByText('1 Oct')).toBeInTheDocument();
  for (const text of ['0', '1k', '2k', '3k']) expect(screen.getByText(text)).toBeInTheDocument();
});
test('RainChart honours an explicit highlight and can hide the average', () => {
  const { container } = render(<RainChart data={[1, 2, 3]} max={3} highlight={0} showAverage={false} label="Three days" />);
  expect(container.querySelector('[data-highlight]')).toBe(container.querySelectorAll('i')[0]);
  expect(container.querySelector('div[style*="bottom: 66.667%"]')).toBeNull();
});

test('Keypad reports every key and exposes the delete action by name', async () => {
  const user = userEvent.setup();
  const onKey = vi.fn<(key: KeypadKey) => void>();
  render(<Keypad onKey={onKey} />);
  expect(screen.getByRole('group', { name: 'Amount keypad' })).toBeInTheDocument();
  for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0']) await user.click(screen.getByRole('button', { name: key }));
  await user.click(screen.getByRole('button', { name: 'Delete last digit' }));
  expect(onKey.mock.calls.map(([key]) => key)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'delete']);
  expect(screen.queryByRole('button', { name: 'Decimal point' })).not.toBeInTheDocument();
});
test('Keypad decimal mode swaps 00 for a decimal point and can be disabled', async () => {
  const user = userEvent.setup();
  const onKey = vi.fn();
  const { rerender } = render(<Keypad onKey={onKey} decimal label="Transfer amount" />);
  expect(screen.queryByRole('button', { name: '00' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Decimal point' }));
  expect(onKey).toHaveBeenCalledWith('.');
  expect(screen.getByRole('group', { name: 'Transfer amount' })).toBeInTheDocument();
  rerender(<Keypad onKey={onKey} disabled />);
  await user.click(screen.getByRole('button', { name: '5' }));
  expect(onKey).toHaveBeenCalledTimes(1);
  expect(screen.getAllByRole('button')).toHaveLength(12);
});

test('Drizzle with a label is a status; without one it is hidden', () => {
  const { container, rerender } = render(<Drizzle label="Loading statement" size="lg" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading statement');
  expect(container.querySelectorAll('i')).toHaveLength(8);
  rerender(<Drizzle className="mine" />);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  expect(container.firstElementChild).toHaveClass('mine');
});

test('measurement components have no automated WCAG 2.2 AA structural violations', async () => {
  render(<main>
    <Readout value={482315.4} fraction="always" />
    <Tape value={2400} max={100000} />
    <Gauge value={39776} max={60000} limit={55000} label="October budget" />
    <Meter value={39776} max={60000} limit={55000} label="October budget, compact" />
    <RainChart data={[1200, 3000, null]} xLabels={['1 Oct', '3']} label="Daily spend" />
    <Keypad onKey={() => {}} />
    <Drizzle label="Loading" />
    <Drizzle />
  </main>);
  const results = await axe.run(document.body, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false } } });
  expect(results.violations).toEqual([]);
});
