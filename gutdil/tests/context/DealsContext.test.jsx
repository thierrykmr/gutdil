import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DealsProvider, useDeals } from '../../src/context/DealsContext';

function TestConsumer() {
  const {
    deals,
    setDeals,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    resetDeals,
    refreshTrigger,
  } = useDeals();

  return (
    <div>
      <span data-testid="deals-count">{deals.length}</span>
      <span data-testid="search">{searchQuery}</span>
      <span data-testid="category">{selectedCategory}</span>
      <span data-testid="refresh">{refreshTrigger}</span>
      <button type="button" onClick={() => setDeals([{ id: '1' }])}>add</button>
      <button type="button" onClick={() => setSearchQuery('react')}>search</button>
      <button type="button" onClick={() => setSelectedCategory('Tech')}>cat</button>
      <button type="button" onClick={resetDeals}>reset</button>
    </div>
  );
}

describe('DealsContext', () => {
  it('provides default state and updates via setters', async () => {
    const user = userEvent.setup();
    render(
      <DealsProvider>
        <TestConsumer />
      </DealsProvider>
    );

    expect(screen.getByTestId('deals-count')).toHaveTextContent('0');
    expect(screen.getByTestId('search')).toHaveTextContent('');
    expect(screen.getByTestId('refresh')).toHaveTextContent('0');

    await user.click(screen.getByText('add'));
    expect(screen.getByTestId('deals-count')).toHaveTextContent('1');

    await user.click(screen.getByText('search'));
    expect(screen.getByTestId('search')).toHaveTextContent('react');

    await user.click(screen.getByText('cat'));
    expect(screen.getByTestId('category')).toHaveTextContent('Tech');
  });

  it('resetDeals clears deals and increments refreshTrigger', async () => {
    const user = userEvent.setup();
    render(
      <DealsProvider>
        <TestConsumer />
      </DealsProvider>
    );

    await user.click(screen.getByText('add'));
    await user.click(screen.getByText('reset'));

    expect(screen.getByTestId('deals-count')).toHaveTextContent('0');
    expect(screen.getByTestId('refresh')).toHaveTextContent('1');
  });
});
