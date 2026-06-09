import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import Alert from '../../src/components/Alert';
import { AlertProvider, useAlert } from '../../src/context/AlertContext';

function AlertTrigger({ msg, type }) {
  const { setAlert } = useAlert();
  useEffect(() => {
    setAlert(msg, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Alert />;
}

describe('Alert', () => {
  it('renders nothing when no message', () => {
    const { container } = render(
      <AlertProvider>
        <Alert />
      </AlertProvider>
    );
    expect(container.querySelector('.fixed')).toBeNull();
  });

  it('renders success alert', () => {
    render(
      <AlertProvider>
        <AlertTrigger msg="Success!" type="success" />
      </AlertProvider>
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders error alert with red background', () => {
    render(
      <AlertProvider>
        <AlertTrigger msg="Error!" type="error" />
      </AlertProvider>
    );
    const alert = screen.getByText('Error!');
    expect(alert.closest('.fixed')).toHaveClass('bg-red-600');
  });
});
