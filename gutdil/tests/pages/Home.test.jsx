import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';
import { DealsProvider } from '../../src/context/DealsContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/components/DealList', () => ({
  default: function MockDealList() {
    return <div data-testid="deal-list">DealList</div>;
  }
}));

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home content when authenticated', () => {
    useAuth.mockReturnValue({
      currentUser: { uid: 'u1', email: 'user@test.com' },
    });
    render(
      <MemoryRouter>
        <DealsProvider>
          <Home />
        </DealsProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Les derniers Bons Plans/i)).toBeInTheDocument();
    expect(screen.getByTestId('deal-list')).toBeInTheDocument();
  });
});
