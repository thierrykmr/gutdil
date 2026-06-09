import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

const mockUnsubscribe = vi.fn();
const mockOnAuthStateChanged = vi.fn((auth, callback) => {
  callback(null);
  return mockUnsubscribe;
});
const mockSignOut = vi.fn();

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  signOut: (...args) => mockSignOut(...args),
}));

function TestConsumer() {
  const { currentUser } = useAuth();
  return <span data-testid="user">{currentUser ? currentUser.email : 'none'}</span>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when auth state is loaded', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('none');
    });
    expect(mockOnAuthStateChanged).toHaveBeenCalled();
  });

  it('provides current user when authenticated', async () => {
    mockOnAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback({ uid: 'u1', email: 'user@test.com' });
      return mockUnsubscribe;
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('user@test.com');
    });
  });
});
