import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}));

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ currentUser: null }),
}));
vi.mock('../src/components/Navbar', () => ({
  default: function MockNavbar() {
    return <nav data-testid="navbar">Gutdil</nav>;
  }
}));

vi.mock('../src/components/Footer', () => ({
  default: function MockFooter() {
    return <footer data-testid="footer">GUTDIL</footer>;
  }
}));

vi.mock('../src/components/Alert', () => ({
  default: function MockAlert() {
    return null;
  }
}));

import App from '../src/App';

describe('App', () => {
  it('renders layout with navbar, outlet and footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<div>Page content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
