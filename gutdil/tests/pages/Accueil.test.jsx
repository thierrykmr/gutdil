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
    expect(screen.getByRole('link', { name: /Commencer/i })).toHaveAttribute('href', '/connexion');
    expect(screen.getByRole('link', { name: /En savoir plus/i })).toHaveAttribute('href', '/a-propos');
  });
});
