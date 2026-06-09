import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../src/pages/NotFound';

describe('NotFound', () => {
  it('renders 404 page with home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Ce bon plan n'existe plus/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Retourner à l'accueil/i })).toHaveAttribute('href', '/home');
  });
});
