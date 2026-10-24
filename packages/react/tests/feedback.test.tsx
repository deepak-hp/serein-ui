import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Avatar, Alert, Progress, Spinner, Skeleton, ToastProvider, useToast } from '../src/feedback';

test('avatar falls back to initials when an image cannot load', () => {
  render(<Avatar name="Deepak HP" src="/missing.png" />);
  fireEvent.error(screen.getByRole('img', { name: 'Deepak HP' }));
  expect(screen.getByRole('img', { name: 'Deepak HP' })).toHaveTextContent('DH');
});
test('progress is labeled and clamps values to its bounds', () => {
  render(<Progress label="Uploading" value={120} max={100} />);
  expect(screen.getByRole('progressbar', { name: 'Uploading' })).toHaveAttribute('value', '100');
  expect(screen.getByText('100%')).toBeInTheDocument();
});
test('loading and alert feedback expose text with appropriate announcements', () => {
  render(<><Spinner label="Saving changes" /><Skeleton label="Loading account" /><Alert title="Payment failed" tone="error" live="assertive">Try another card.</Alert></>);
  expect(screen.getByRole('status')).toHaveTextContent('Saving changes');
  expect(screen.getByRole('alert')).toHaveTextContent('Try another card.');
  expect(screen.getByText('Loading account')).toBeInTheDocument();
});
test('toasts can be created and dismissed with a named control', async () => {
  function Example() { const toast = useToast(); return <button onClick={() => toast.add({ title: 'Changes saved', description: 'Your account is up to date.' })}>Save</button>; }
  render(<ToastProvider timeout={0}><Example /></ToastProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText('Your account is up to date.')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  await waitFor(() => expect(screen.queryByText('Your account is up to date.')).not.toBeInTheDocument());
});
