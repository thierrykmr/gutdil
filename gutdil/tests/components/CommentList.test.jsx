import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CommentList from '../../src/components/CommentList';

const mockUnsubscribe = vi.fn();
const mockOnSnapshot = vi.fn((q, callback) => {
  callback({
    docs: [
      {
        id: 'c1',
        data: () => ({
          authorEmail: 'user@test.com',
          text: 'Great deal!',
          createdAt: { toDate: () => new Date('2025-01-15T10:00:00') },
        }),
      },
    ],
  });
  return mockUnsubscribe;
});

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: (...args) => mockOnSnapshot(...args),
}));

describe('CommentList', () => {
  it('displays comments from snapshot', async () => {
    render(<CommentList dealId="deal-1" />);
    await waitFor(() => {
      expect(screen.getByText('Great deal!')).toBeInTheDocument();
    });
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  it('shows empty state when no comments', async () => {
    mockOnSnapshot.mockImplementationOnce((q, callback) => {
      callback({ docs: [] });
      return mockUnsubscribe;
    });
    render(<CommentList dealId="deal-1" />);
    await waitFor(() => {
      expect(screen.getByText(/Aucun commentaire pour l'instant/i)).toBeInTheDocument();
    });
  });
});
