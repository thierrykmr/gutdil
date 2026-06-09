import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DealCard from '../../src/components/DealCard';
import { DealsProvider } from '../../src/context/DealsContext';
import { AlertProvider } from '../../src/context/AlertContext';

const mockNavigate = vi.fn();
const mockUnsubscribe = vi.fn();

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

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  runTransaction: vi.fn(),
  onSnapshot: vi.fn((ref, callback) => {
    callback({ exists: () => false });
    return mockUnsubscribe;
  }),
  deleteDoc: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  deleteObject: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';

const mockDeal = {
  id: 'deal-1',
  title: 'Formation React',
  description: 'Un excellent cours',
  category: 'Education',
  authorId: 'user-123',
  authorEmail: 'author@test.com',
  imageUrl: 'https://example.com/img.jpg',
  createdAt: { toDate: () => new Date('2025-06-01T12:00:00') },
  likeCount: 5,
  commentCount: 2,
};

function renderDealCard(deal = mockDeal, user = { uid: 'user-123', email: 'user@test.com' }) {
  useAuth.mockReturnValue({ currentUser: user });
  return render(
    <MemoryRouter>
      <AlertProvider>
        <DealsProvider>
          <DealCard deal={deal} />
        </DealsProvider>
      </AlertProvider>
    </MemoryRouter>
  );
}

describe('DealCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders deal title and category', () => {
    renderDealCard();
    expect(screen.getByText('Formation React')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('shows owner actions when user is author', () => {
    renderDealCard();
    expect(screen.getByLabelText('Modifier le deal')).toBeInTheDocument();
    expect(screen.getByLabelText('Supprimer le deal')).toBeInTheDocument();
  });

  it('hides owner actions for non-owner', () => {
    renderDealCard(mockDeal, { uid: 'other-user', email: 'other@test.com' });
    expect(screen.queryByLabelText('Modifier le deal')).not.toBeInTheDocument();
  });

  it('links to deal detail page', () => {
    renderDealCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/deals/deal-1');
  });

  it('renders share button', () => {
    renderDealCard();
    expect(screen.getByLabelText('Partager ce deal')).toBeInTheDocument();
  });
});
