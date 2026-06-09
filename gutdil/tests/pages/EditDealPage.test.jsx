import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditDealPage from '../../src/pages/EditDealPage';
import { AlertProvider } from '../../src/context/AlertContext';

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

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args) => mockGetDoc(...args),
  updateDoc: vi.fn().mockResolvedValue({}),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';

describe('EditDealPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      currentUser: { uid: 'user-123', email: 'user@test.com' },
    });
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        title: 'Deal à modifier',
        description: 'Description',
        category: 'Tech',
        authorId: 'user-123',
        price: '10',
        link: 'https://example.com',
      }),
    });
  });

  it('loads deal form for owner', async () => {
    render(
      <MemoryRouter initialEntries={['/edit-deal/deal-1']}>
        <AlertProvider>
          <Routes>
            <Route path="/edit-deal/:dealId" element={<EditDealPage />} />
          </Routes>
        </AlertProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('Deal à modifier')).toBeInTheDocument();
    });
  });

  it('redirects when user is not owner', async () => {
    useAuth.mockReturnValue({
      currentUser: { uid: 'other-user', email: 'other@test.com' },
    });
    render(
      <MemoryRouter initialEntries={['/edit-deal/deal-1']}>
        <AlertProvider>
          <Routes>
            <Route path="/edit-deal/:dealId" element={<EditDealPage />} />
          </Routes>
        </AlertProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/deals/deal-1');
    });
  });
});
