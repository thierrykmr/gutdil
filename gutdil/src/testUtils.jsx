import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DealsProvider } from './context/DealsContext';
import { AlertProvider } from './context/AlertContext';

const mockUser = {
  uid: 'user-123',
  email: 'test@example.com',
};

export function renderWithRouter(ui, { route = '/', ...options } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AlertProvider>
        <DealsProvider>{ui}</DealsProvider>
      </AlertProvider>
    </MemoryRouter>,
    options
  );
}

export { mockUser };
