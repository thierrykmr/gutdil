import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateDeal from '../../src/components/CreateDeal';
import { DealsProvider } from '../../src/context/DealsContext';
import { AlertProvider } from '../../src/context/AlertContext';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'new-deal' }),
  serverTimestamp: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn().mockResolvedValue({}),
  getDownloadURL: vi.fn().mockResolvedValue('https://example.com/img.jpg'),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('CreateDeal', () => {
  const onDealPosted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      currentUser: { uid: 'u1', email: 'user@test.com' },
    });
  });

  it('renders form fields', () => {
    render(
      <AlertProvider>
        <DealsProvider>
          <CreateDeal onDealPosted={onDealPosted} />
        </DealsProvider>
      </AlertProvider>
    );
    expect(screen.getByPlaceholderText(/Gemini gratuit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Poster le deal/i })).toBeInTheDocument();
  });

  it('shows error when user is not logged in', async () => {
    useAuth.mockReturnValue({ currentUser: null });
    const user = userEvent.setup();
    render(
      <AlertProvider>
        <DealsProvider>
          <CreateDeal onDealPosted={onDealPosted} />
        </DealsProvider>
      </AlertProvider>
    );
    await user.selectOptions(screen.getByLabelText(/Catégorie/i), 'Tech');
    await user.type(screen.getByPlaceholderText(/Gemini gratuit/i), 'Mon deal');
    await user.type(screen.getByPlaceholderText(/Donnez plus de détails/i), 'Description');
    await user.click(screen.getByRole('button', { name: /Poster le deal/i }));
    expect(screen.getByText(/connecté pour poster/i)).toBeInTheDocument();
    expect(onDealPosted).not.toHaveBeenCalled();
  });
});
