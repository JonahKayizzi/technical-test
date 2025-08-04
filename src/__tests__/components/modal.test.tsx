import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/layout/modal.layout';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders when open', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Modal {...defaultProps} title="Test Modal" />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('renders with footer', () => {
      render(
        <Modal {...defaultProps} footer={<button>Footer Button</button>} />
      );
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Modal {...defaultProps} className="custom-class" />);
      const modal = screen.getByRole('document');
      expect(modal).toHaveClass('custom-class');
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Modal {...defaultProps} size="sm" />);
      const modal = screen.getByRole('document');
      expect(modal).toHaveClass('max-w-sm');
    });

    it('renders medium size by default', () => {
      render(<Modal {...defaultProps} />);
      const modal = screen.getByRole('document');
      expect(modal).toHaveClass('max-w-md');
    });

    it('renders large size', () => {
      render(<Modal {...defaultProps} size="lg" />);
      const modal = screen.getByRole('document');
      expect(modal).toHaveClass('max-w-lg');
    });

    it('renders extra large size', () => {
      render(<Modal {...defaultProps} size="xl" />);
      const modal = screen.getByRole('document');
      expect(modal).toHaveClass('max-w-xl');
    });
  });

  describe('Close Button', () => {
    it('shows close button by default', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Backdrop Click', () => {
    it('calls onClose when backdrop is clicked by default', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when closeOnBackdropClick is false', () => {
      const onClose = jest.fn();
      render(
        <Modal
          {...defaultProps}
          onClose={onClose}
          closeOnBackdropClick={false}
        />
      );

      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking modal content', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      const modal = screen.getByRole('document');
      fireEvent.click(modal);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Escape Key', () => {
    it('calls onClose when escape key is pressed by default', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when closeOnEscape is false', () => {
      const onClose = jest.fn();
      render(
        <Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose for other keys', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading overlay when loading is true', () => {
      render(<Modal {...defaultProps} loading />);
      expect(screen.getByRole('document')).toBeInTheDocument();
    });

    it('does not show loading overlay when loading is false', () => {
      render(<Modal {...defaultProps} loading={false} />);
      expect(screen.getByRole('document')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper dialog role', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has proper aria-modal attribute', () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('has proper aria-labelledby when title is provided', () => {
      render(<Modal {...defaultProps} title="Test Modal" />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('focuses first focusable element when opened', () => {
      render(
        <Modal {...defaultProps}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );

      const firstButton = screen.getByText('First Button');
      expect(firstButton).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('traps focus within modal', async () => {
      const user = userEvent.setup();
      render(
        <Modal {...defaultProps}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );

      const firstButton = screen.getByText('First Button');
      const secondButton = screen.getByText('Second Button');

      // Focus should start on first button
      expect(firstButton).toBeInTheDocument();

      // Tab should move to second button
      await user.tab();
      expect(secondButton).toBeInTheDocument();

      // Tab again should wrap back to first button
      await user.tab();
      expect(firstButton).toBeInTheDocument();
    });

    it('handles shift+tab for reverse focus', async () => {
      const user = userEvent.setup();
      render(
        <Modal {...defaultProps}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );

      const firstButton = screen.getByText('First Button');
      const secondButton = screen.getByText('Second Button');

      // Focus second button
      secondButton.focus();
      expect(secondButton).toBeInTheDocument();

      // Shift+Tab should move to first button
      await user.tab({ shift: true });
      expect(firstButton).toBeInTheDocument();
    });
  });

  describe('Body Scroll Prevention', () => {
    it('prevents body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when modal is closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      // Close modal
      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Combined Props', () => {
    it('renders with all props correctly', () => {
      const onClose = jest.fn();
      render(
        <Modal
          {...defaultProps}
          title="Complex Modal"
          size="lg"
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
          loading={false}
          className="custom-class"
          footer={<button>Custom Footer</button>}
          onClose={onClose}
        >
          <div>Complex content</div>
        </Modal>
      );

      // Check content is rendered
      expect(screen.getByText('Complex Modal')).toBeInTheDocument();
      expect(screen.getByText('Complex content')).toBeInTheDocument();
      expect(screen.getByText('Custom Footer')).toBeInTheDocument();

      // Check close button
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();

      // Check classes
      const modal = screen.getByRole('document');
      expect(modal).toHaveClass('custom-class');
      expect(modal).toHaveClass('max-w-lg');

      // Check accessibility
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });
});
