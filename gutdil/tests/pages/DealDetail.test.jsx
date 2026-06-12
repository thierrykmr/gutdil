import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DealDetail from '../../src/pages/DealDetail';

const mockNavigate = vi.fn();
const mockGetDoc = vi.fn();

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
vi.mock('../../src/context/AlertContext', () => ({
  useAlert: () => ({ setAlert: vi.fn() }),
}));
vi.mock('../../src/components/CommentList', () => ({
  default: function MockCommentList() {
    return <div data-testid="comment-list">Comments</div>;
  }
}));

vi.mock('../../src/components/CommentForm', () => ({
  default: function MockCommentForm() {
    return <div data-testid="comment-form">Form</div>;
  }
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn((ref, callback) => {
    callback({ exists: () => true, data: () => ({ commentCount: 3 }) });
    return vi.fn();
  }),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('DealDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      currentUser: { uid: 'u1', email: 'user@test.com' },
    });
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'deal-1',
      data: () => ({
        title: 'Super Deal',
        description: 'Description du deal',
        category: 'Tech',
        commentCount: 2,
      }),
    });
  });

  it('loads and displays deal details', async () => {
    render(
      <MemoryRouter initialEntries={['/deals/deal-1']}>
        <Routes>
          <Route path="/deals/:dealId" element={<DealDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Super Deal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('comment-list')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Partager' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retirer des favoris' })).toBeInTheDocument();
  });
});
