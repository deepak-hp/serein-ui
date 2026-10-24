import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Platform } from 'react-native';
import { themes } from '@serein-ui/tokens';
import { SereinProvider, TextField } from '../src';

describe('TextField', () => {
  it('labels the input and reports typed text', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Recipient" description="Name or UPI ID" onChangeText={onChangeText} />);
    const input = screen.getByLabelText('Recipient');
    expect(input).toHaveProp('accessibilityHint', 'Name or UPI ID');
    expect(input).toHaveStyle({ minHeight: 48 });
    await fireEvent.changeText(input, 'Asha');
    expect(onChangeText).toHaveBeenCalledWith('Asha');
  });

  it('shows the error as an alert in danger colour and announces it', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await render(<SereinProvider theme="light"><TextField label="Amount" error="Enter an amount" /></SereinProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter an amount');
    expect(screen.getByRole('alert')).toHaveStyle({ color: themes.light.color.danger });
    expect(screen.getByLabelText('Amount')).toHaveStyle({ borderColor: themes.light.color.danger });
    expect(screen.getByLabelText('Amount')).toHaveProp('accessibilityHint', 'Enter an amount');
    if (Platform.OS === 'ios') expect(announce).toHaveBeenCalledWith('Enter an amount');
  });

  it('is not editable when disabled', async () => {
    await render(<TextField label="Reference" disabled />);
    expect(screen.getByLabelText('Reference')).toHaveProp('editable', false);
  });
});
