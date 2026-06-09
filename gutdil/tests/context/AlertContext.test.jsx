import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AlertProvider, useAlert } from '../../src/context/AlertContext';

function TestConsumer() {
  const { alert, setAlert } = useAlert();
  return (
    <div>
      <span data-testid="msg">{alert.msg}</span>
      <span data-testid="type">{alert.type}</span>
      <button type="button" onClick={() => setAlert('Done!', 'success')}>show</button>
    </div>
  );
}

describe('AlertContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and clears alert after timeout', () => {
    render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    expect(screen.getByTestId('msg')).toHaveTextContent('');
    act(() => {
      screen.getByText('show').click();
    });
    expect(screen.getByTestId('msg')).toHaveTextContent('Done!');
    expect(screen.getByTestId('type')).toHaveTextContent('success');

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('msg')).toHaveTextContent('');
  });
});
