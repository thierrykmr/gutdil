import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders children when open', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    await user.click(screen.getByLabelText('Fermer le modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
