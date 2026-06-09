import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../../src/pages/Contact';
import { AlertProvider } from '../../src/context/AlertContext';

const mockSend = vi.fn();

vi.mock('@emailjs/browser', () => ({
  default: {
    send: (...args) => mockSend(...args),
  },
  send: (...args) => mockSend(...args),
}));

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ status: 200, text: 'OK' });
  });

  it('shows login required message when not authenticated', () => {
    useAuth.mockReturnValue({ currentUser: null });
    render(
      <MemoryRouter>
        <AlertProvider>
          <Contact />
        </AlertProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Vous devez vous connecter/i)).toBeInTheDocument();
  });

  it('shows connected user email', () => {
    useAuth.mockReturnValue({ currentUser: { email: 'user@test.com' } });
    render(
      <MemoryRouter>
        <AlertProvider>
          <Contact />
        </AlertProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  it('blocks submit when not logged in', async () => {
    useAuth.mockReturnValue({ currentUser: null });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AlertProvider>
          <Contact />
        </AlertProvider>
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText(/objet de votre demande/i), 'Help');
    await user.type(screen.getByPlaceholderText(/Décrivez votre problème/i), 'Message body');
    await user.click(screen.getByRole('button', { name: /Envoyer mon message/i }));
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('sends email when authenticated', async () => {
    useAuth.mockReturnValue({ currentUser: { email: 'user@test.com' } });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AlertProvider>
          <Contact />
        </AlertProvider>
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText(/objet de votre demande/i), 'Subject');
    await user.type(screen.getByPlaceholderText(/Décrivez votre problème/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /Envoyer mon message/i }));
    await waitFor(() => {
      expect(mockSend).toHaveBeenCalled();
    });
  });
});
