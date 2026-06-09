import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profil from '../../src/pages/Profil';
import { AlertProvider } from '../../src/context/AlertContext';
import { useAuth } from '../../src/context/AuthContext';
import { DealsProvider } from '../../src/context/DealsContext';

const mockUnsubscribe = vi.fn();
const mockUpdateProfile = vi.fn();

const mockDealsList = [
  {
    id: 'deal-1',
    title: 'Deal 1',
    description: 'Description 1',
    category: 'Tech',
    authorId: 'user-123',
    likeCount: 5,
    commentCount: 2,
    createdAt: { toDate: () => new Date('2026-06-01') },
  },
  {
    id: 'deal-2',
    title: 'Deal 2',
    description: 'Description 2',
    category: 'Tech',
    authorId: 'user-123',
    likeCount: 10,
    commentCount: 4,
    createdAt: { toDate: () => new Date('2026-06-02') },
  },
];

const mockQueryObj = { type: 'query' };

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(() => mockQueryObj),
  where: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  runTransaction: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn((target, callback) => {
    if (target && target.type === 'query') {
      callback({
        docs: [
          {
            id: 'deal-1',
            data: () => ({
              id: 'deal-1',
              title: 'Deal 1',
              description: 'Description 1',
              category: 'Tech',
              authorId: 'user-123',
              likeCount: 5,
              commentCount: 2,
              createdAt: { toDate: () => new Date('2026-06-01') },
            }),
          },
          {
            id: 'deal-2',
            data: () => ({
              id: 'deal-2',
              title: 'Deal 2',
              description: 'Description 2',
              category: 'Tech',
              authorId: 'user-123',
              likeCount: 10,
              commentCount: 4,
              createdAt: { toDate: () => new Date('2026-06-02') },
            }),
          },
        ],
      });
    } else {
      callback({
        exists: () => false,
        data: () => ({ likeCount: 5, commentCount: 2 }),
      });
    }
    return () => {};
  }),
}));

vi.mock('firebase/auth', () => ({
  updateProfile: (...args) => mockUpdateProfile(...args),
}));

vi.mock('../../src/firebaseConfig', () => ({
  db: {},
  auth: { currentUser: {} },
}));

const mockUser = {
  uid: 'user-123',
  email: 'user@test.com',
  displayName: 'Chema',
  metadata: { creationTime: '2026-01-01T10:00:00Z' },
};

describe('Profil Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ currentUser: mockUser });
  });

  const renderProfil = () => {
    return render(
      <MemoryRouter>
        <AlertProvider>
          <DealsProvider>
            <Profil />
          </DealsProvider>
        </AlertProvider>
      </MemoryRouter>
    );
  };

  it('renders user information correctly', () => {
    renderProfil();

    expect(screen.getByText('Chema')).toBeInTheDocument();
    expect(screen.getByText(/user@test\.com/)).toBeInTheDocument();
    expect(screen.getByText(/Membre depuis le :/i)).toBeInTheDocument();
  });

  it('computes and displays statistics correctly', () => {
    renderProfil();

    // Deals postés: 2
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Likes reçus: 5 + 10 = 15
    expect(screen.getByText('❤️ 15')).toBeInTheDocument();

    // Commentaires: 2 + 4 = 6
    expect(screen.getByText('💬 6')).toBeInTheDocument();

    // Catégorie favorite: Tech (appears once in stats since deal cards are no longer rendered)
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('allows editing display name', async () => {
    mockUpdateProfile.mockResolvedValueOnce();

    renderProfil();

    // Click edit button
    const editBtn = screen.getByLabelText("Modifier le nom d'affichage");
    fireEvent.click(editBtn);

    // Modify input
    const input = screen.getByPlaceholderText("Nom d'affichage");
    fireEvent.change(input, { target: { value: 'NewChema' } });

    // Submit form
    const saveBtn = screen.getByLabelText('Enregistrer');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });
});
