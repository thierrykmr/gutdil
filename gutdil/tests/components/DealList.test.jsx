import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DealList from '../../src/components/DealList';
import { DealsProvider } from '../../src/context/DealsContext';

const mockGetDocs = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn((...args) => args),
  orderBy: vi.fn(),
  limit: vi.fn(),
  where: vi.fn(),
  startAfter: vi.fn(),
  getDocs: (...args) => mockGetDocs(...args),
}));

vi.mock('../../src/components/DealCard', () => ({
  default: function MockDealCard({ deal }) {
    return <div data-testid="deal-card">{deal.title}</div>;
  }
}));

describe('DealList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'd1',
          data: () => ({
            title: 'Test Deal',
            description: 'Desc',
            category: 'Tech',
            createdAt: new Date(),
          }),
        },
      ],
    });
  });

  it('loads and displays deals', async () => {
    render(
      <DealsProvider>
        <DealList />
      </DealsProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('deal-card')).toHaveTextContent('Test Deal');
    });
  });

  it('shows empty message when no deals', async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] });
    render(
      <DealsProvider>
        <DealList />
      </DealsProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Aucun deal trouvé/i)).toBeInTheDocument();
    });
  });
});
