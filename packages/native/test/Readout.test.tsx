import { render, screen } from '@testing-library/react-native';
import { formatMoney } from '@serein-ui/format';
import { Readout } from '../src';

describe('Readout', () => {
  it('reads the full formatted amount and shows Indian grouping', async () => {
    await render(<Readout value={125000.5} />);
    const readout = screen.getByLabelText(formatMoney(125000.5));
    expect(readout).toHaveTextContent('₹1,25,000.50');
  });

  it('uses the readout type token with tabular figures in Anek Latin Light', async () => {
    await render(<Readout value={2400} size="l" />);
    expect(screen.getByLabelText('₹2,400')).toHaveStyle({ fontSize: 60, lineHeight: 64, fontFamily: 'AnekLatin-Light', fontVariant: ['tabular-nums'] });
  });

  it('shows a true minus sign for negatives', async () => {
    await render(<Readout value={-80} size="m" />);
    expect(screen.getByLabelText(formatMoney(-80))).toHaveTextContent('−₹80');
  });
});
