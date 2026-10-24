import { useState } from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Switch } from '../src';

function Controlled({ onChange }: { onChange: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  return <Switch label="Notify me" description="When money arrives" checked={checked} onCheckedChange={(next) => { setChecked(next); onChange(next); }} />;
}

describe('Switch', () => {
  it('is a labelled switch whose whole row toggles it', async () => {
    const onChange = jest.fn();
    await render(<Controlled onChange={onChange} />);
    const control = screen.getByRole('switch', { name: 'Notify me' });
    expect(control).not.toBeChecked();
    expect(control).toHaveProp('accessibilityHint', 'When money arrives');
    expect(control).toHaveStyle({ minHeight: 48 });
    await userEvent.press(control);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    const onCheckedChange = jest.fn();
    await render(<Switch label="Autopay" checked onCheckedChange={onCheckedChange} disabled />);
    const control = screen.getByRole('switch', { name: 'Autopay' });
    expect(control).toBeDisabled();
    await userEvent.press(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
