import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/layout/input.layout';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Input id="test" name="test" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input id="test" name="test" label="Test Label" />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders required indicator', () => {
      render(<Input id="test" name="test" label="Test Label" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders placeholder', () => {
      render(<Input id="test" name="test" placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<Input id="test" name="test" value="test value" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input id="test" name="test" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<Input id="test" name="test" type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders number input', () => {
      render(<Input id="test" name="test" type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders textarea', () => {
      render(<Input id="test" name="test" type="textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('States', () => {
    it('can be disabled', () => {
      render(<Input id="test" name="test" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('can be loading', () => {
      render(<Input id="test" name="test" loading />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Input id="test" name="test" className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Interactions', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input id="test" name="test" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('updates value on change', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input id="test" name="test" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'new value');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message', () => {
      render(<Input id="test" name="test" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error styling', () => {
      render(<Input id="test" name="test" error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300');
    });

    it('shows error with character count', () => {
      render(
        <Input
          id="test"
          name="test"
          error="Error"
          maxLength={10}
          showCharacterCount
        />
      );
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('0/10')).toBeInTheDocument();
    });
  });

  describe('Character Count', () => {
    it('shows character count when enabled', () => {
      render(
        <Input
          id="test"
          name="test"
          value="test"
          maxLength={10}
          showCharacterCount
        />
      );
      expect(screen.getByText('4/10')).toBeInTheDocument();
    });

    it('shows character count without error', () => {
      render(
        <Input
          id="test"
          name="test"
          value="test"
          maxLength={10}
          showCharacterCount
        />
      );
      expect(screen.getByText('4/10')).toBeInTheDocument();
    });

    it('changes color when near limit', () => {
      render(
        <Input
          id="test"
          name="test"
          value="123456789"
          maxLength={10}
          showCharacterCount
        />
      );
      const countElement = screen.getByText('9/10');
      expect(countElement).toHaveClass('text-yellow-600');
    });

    it('changes color when at limit', () => {
      render(
        <Input
          id="test"
          name="test"
          value="1234567890"
          maxLength={10}
          showCharacterCount
        />
      );
      const countElement = screen.getByText('10/10');
      expect(countElement).toHaveClass('text-red-600');
    });
  });

  describe('Validation', () => {
    it('renders with validation props', () => {
      render(
        <Input
          id="test"
          name="test"
          validation={{ minLength: 5 }}
          validateOnChange
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with custom validation', () => {
      const customValidator = (value: string) => {
        return value === 'valid' ? null : 'Custom error message';
      };

      render(
        <Input
          id="test"
          name="test"
          validation={{ custom: customValidator }}
          validateOnChange
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Textarea Specific', () => {
    it('renders textarea with rows', () => {
      render(<Input id="test" name="test" type="textarea" rows={5} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('renders textarea with default rows', () => {
      render(<Input id="test" name="test" type="textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });
  });

  describe('Accessibility', () => {
    it('has proper label association', () => {
      render(<Input id="test" name="test" label="Test Label" />);
      const input = screen.getByLabelText('Test Label');
      expect(input).toBeInTheDocument();
    });

    it('has proper id and name attributes', () => {
      render(<Input id="test-input" name="testName" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'test-input');
      expect(input).toHaveAttribute('name', 'testName');
    });

    it('can be focused', () => {
      render(<Input id="test" name="test" />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });
  });

  describe('Combined Props', () => {
    it('renders with multiple props correctly', () => {
      render(
        <Input
          id="complex"
          name="complex"
          type="email"
          label="Email Address"
          placeholder="Enter email"
          value="test@example.com"
          required
          disabled
          error="Invalid email"
          className="custom-class"
          maxLength={50}
          showCharacterCount
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter email');
      expect(input).toHaveValue('test@example.com');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('custom-class');
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('16/50')).toBeInTheDocument();
    });
  });
});
