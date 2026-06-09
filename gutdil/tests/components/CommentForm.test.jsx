import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentForm from '../../src/components/CommentForm';
import { AlertProvider } from '../../src/context/AlertContext';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({}),
  serverTimestamp: vi.fn(),
  runTransaction: vi.fn((db, fn) => fn({ update: vi.fn() })),
  increment: vi.fn((n) => n),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('CommentForm', () => {
  it('shows login message when not authenticated', () => {
    useAuth.mockReturnValue({ currentUser: null });
    render(
      <AlertProvider>
        <CommentForm dealId="deal-1" />
      </AlertProvider>
    );
    expect(screen.getByText(/Connectez-vous pour participer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Commenter/i })).toBeDisabled();
  });

  it('allows typing when authenticated', async () => {
    useAuth.mockReturnValue({
      currentUser: { uid: 'u1', email: 'user@test.com' },
    });
    const user = userEvent.setup();
    render(
      <AlertProvider>
        <CommentForm dealId="deal-1" />
      </AlertProvider>
    );
    const textarea = screen.getByPlaceholderText(/Écrivez votre commentaire/i);
    await user.type(textarea, 'Nice!');
    expect(textarea).toHaveValue('Nice!');
  });
});
