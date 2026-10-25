import { render, screen, userEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { themes } from '@serein-ui/tokens';
import { Button, SereinProvider } from '../src';

const surface = (el: ReturnType<typeof screen.getByRole>) => StyleSheet.flatten(el.props.style);

describe('Button', () => {
  it('is a 48px button named by its label that responds to presses', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Send ₹2,400</Button>);
    const button = screen.getByRole('button', { name: 'Send ₹2,400' });
    expect(surface(button).minHeight).toBe(48);
    await userEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('fills primary with the signal and dark on-signal ink in each theme', async () => {
    for (const name of ['light', 'dark'] as const) {
      await render(<SereinProvider theme={name}><Button>Pay</Button></SereinProvider>);
      expect(surface(screen.getByRole('button')).backgroundColor).toBe(themes[name].color.signal);
      expect(screen.getByText('Pay')).toHaveStyle({ color: themes[name].color['on-signal'] });
    }
  });

  it.each([
    ['secondary', 'surface-raised', 'ink'],
    ['quiet', null, 'ink'],
    ['danger', 'danger', 'on-danger'],
  ] as const)('renders the %s variant from theme roles', async (variant, fill, ink) => {
    await render(<SereinProvider theme="dark"><Button variant={variant}>Act</Button></SereinProvider>);
    expect(surface(screen.getByRole('button')).backgroundColor).toBe(fill ? themes.dark.color[fill] : 'transparent');
    expect(screen.getByText('Act')).toHaveStyle({ color: themes.dark.color[ink] });
  });

  it('announces busy, ignores presses and keeps the label for width', async () => {
    const onPress = jest.fn();
    await render(<Button busy onPress={onPress}>Send ₹2,400</Button>);
    const button = screen.getByRole('button', { name: 'Send ₹2,400' });
    expect(button).toBeBusy();
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByText('Send ₹2,400')).toHaveStyle({ opacity: 0 });
  });

  it('ignores presses when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button disabled onPress={onPress}>Send</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    await userEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('accepts the web name loading for busy', async () => {
    await render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeBusy();
  });

  it('stays focusable when unavailable and gives the reason', async () => {
    const onPress = jest.fn();
    await render(<Button unavailableReason="Over daily limit" onPress={onPress}>Send ₹60,000</Button>);
    const button = screen.getByRole('button', { name: 'Send ₹60,000' });
    expect(button).toBeDisabled();
    expect(button).toHaveProp('accessibilityHint', 'Over daily limit');
    expect(button).toHaveProp('focusable', true);
    // Visible, but hidden from screen readers because the hint already carries it.
    expect(screen.getByText('Over daily limit', { includeHiddenElements: true })).toBeTruthy();
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
