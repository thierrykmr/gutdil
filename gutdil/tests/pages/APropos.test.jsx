import React from 'react';
import { render, screen } from '@testing-library/react';
import APropos from '../../src/pages/APropos';

describe('APropos', () => {
  it('renders about page content', () => {
    render(<APropos />);
    expect(screen.getByText(/À propos de Gutdil/i)).toBeInTheDocument();
    expect(screen.getByText(/application communautaire/i)).toBeInTheDocument();
  });
});
