import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';

const mockSignOut = vi.fn();

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  signOut: (...args) => mockSignOut(...args),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows login link when user is not authenticated', () => {
    useAuth.mockReturnValue({ currentUser: null });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Connexion \/ Inscription/i)).toBeInTheDocument();
  });

  it('shows email and logout when authenticated', async () => {
    useAuth.mockReturnValue({
      currentUser: { email: 'user@test.com', uid: 'u1' },
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    await user.click(screen.getByText('Déconnexion'));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('toggles mobile menu', async () => {
    useAuth.mockReturnValue({ currentUser: null });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const menuBtn = screen.getByRole('button', { expanded: false });
    await user.click(menuBtn);
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
    expect(screen.getAllByText('Accueil').length).toBeGreaterThan(1);
  });
});
