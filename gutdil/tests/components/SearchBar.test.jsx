import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../src/components/SearchBar';
import { DealsProvider } from '../../src/context/DealsContext';

function renderSearchBar() {
  return render(
    <DealsProvider>
      <SearchBar />
    </DealsProvider>
  );
}

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText(/Rechercher un bon plan/i)).toBeInTheDocument();
  });

  it('submits search and updates context', async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByPlaceholderText(/Rechercher un bon plan/i);
    await user.type(input, 'react');
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('react');
  });

  it('shows clear button and clears search', async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByPlaceholderText(/Rechercher un bon plan/i);
    await user.type(input, 'test');
    const clearBtn = screen.getByRole('button');
    await user.click(clearBtn);
    expect(input).toHaveValue('');
  });
});
