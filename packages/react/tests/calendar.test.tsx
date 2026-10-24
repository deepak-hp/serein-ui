import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar, parseISODate, formatISODate } from '../src/calendar';

test('inclusive bounds disable only days outside the interval and mounting does not steal focus', async () => {
  const user=userEvent.setup();
  const {rerender}=render(<button>Keep focus</button>);
  await user.click(screen.getByRole('button',{name:'Keep focus'}));
  rerender(<><button>Keep focus</button><Calendar label="Schedule" value={null} onValueChange={()=>{}} defaultMonth="2026-09-01" today="2026-09-19" min="2026-09-05" max="2026-09-25" /></>);
  expect(screen.getByRole('button',{name:'Keep focus'})).toHaveFocus();
  expect(screen.getByRole('button',{name:/September 4th/})).toBeDisabled();
  expect(screen.getByRole('button',{name:/September 5th/})).not.toBeDisabled();
  expect(screen.getByRole('button',{name:/September 25th/})).not.toBeDisabled();
  expect(screen.getByRole('button',{name:/September 26th/})).toBeDisabled();
});
test('strict ISO helpers preserve leap days and reject invalid dates', () => { expect(formatISODate(parseISODate('2024-02-29'))).toBe('2024-02-29'); expect(formatISODate(parseISODate('0001-01-01'))).toBe('0001-01-01'); expect(() => parseISODate('2025-02-29')).toThrow(RangeError); expect(() => parseISODate('2026-2-1')).toThrow(RangeError); });
test('calendar arrow navigation moves day focus and Enter selects the focused leap day', async () => { const user = userEvent.setup(); const change = vi.fn(); render(<Calendar label="Leap month" value={null} onValueChange={change} defaultMonth="2024-02-01" min="2024-02-01" max="2024-02-29" today="2024-02-01" />); const day28 = screen.getByRole('button', { name: /February 28/ }); const leapDay = screen.getByRole('button', { name: /February 29/ }); day28.focus(); await user.keyboard('{ArrowRight}'); expect(leapDay).toHaveFocus(); await user.keyboard('{Enter}'); expect(change).toHaveBeenLastCalledWith('2024-02-29'); expect(screen.getByRole('button', { name: /Previous Month/ })).toHaveAttribute('aria-disabled', 'true'); });
