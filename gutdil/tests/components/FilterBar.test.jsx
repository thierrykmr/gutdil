import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../../src/components/FilterBar';
import { DEAL_CATEGORIES } from '../../src/constants/index';

describe('FilterBar', () => {
  it('renders all categories and Tous button', () => {
    render(<FilterBar selectedCategory="" onSelectCategory={vi.fn()} />);
    expect(screen.getByText('Tous')).toBeInTheDocument();
    DEAL_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it('calls onSelectCategory when a category is clicked', async () => {
    const onSelectCategory = vi.fn();
    const user = userEvent.setup();
    render(<FilterBar selectedCategory="" onSelectCategory={onSelectCategory} />);
    await user.click(screen.getByText('Tech'));
    expect(onSelectCategory).toHaveBeenCalledWith('Tech');
  });

  it('highlights selected category', () => {
    render(<FilterBar selectedCategory="Education" onSelectCategory={vi.fn()} />);
    const eduBtn = screen.getByText('Education');
    expect(eduBtn.className).toMatch(/bg-cyan-500/);
  });
});
