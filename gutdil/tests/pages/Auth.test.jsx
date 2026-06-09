import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Auth from '../../src/pages/Auth';

const mockNavigate = vi.fn();
const mockSignIn = vi.fn();
const mockCreateUser = vi.fn();
const mockSignInWithPopup = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ currentUser: null })),
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUser(...args),
  signInWithEmailAndPassword: (...args) => mockSignIn(...args),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ currentUser: null });
    mockSignIn.mockResolvedValue({});
    mockCreateUser.mockResolvedValue({});
    mockSignInWithPopup.mockResolvedValue({});
  });

  it('renders login form by default', () => {
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );
    expect(screen.getByText(/Connectez-vous à votre compte/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('switches to signup mode', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );
    await user.click(screen.getByText(/Pas de compte/i));
    expect(screen.getByText(/Créez un nouveau compte/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });

  it('submits login form', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );
    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Mot de passe/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Se connecter/i }));
    expect(mockSignIn).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('returns null when user is already logged in', () => {
    useAuth.mockReturnValue({ currentUser: { email: 'a@b.com' } });
    const { container } = render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
