import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Accueil from '../../src/pages/Accueil';

describe('Accueil', () => {
  it('renders welcome message and links', () => {
    render(
      <MemoryRouter>
        <Accueil />
      </MemoryRouter>
    );
    expect(screen.getByText(/Bienvenue sur Gutdil/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Découvrir les Bons Plans/i })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('link', { name: /Se connecter/i })).toHaveAttribute('href', '/connexion');
  });
});
