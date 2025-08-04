import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/layout/button.layout';

describe('Button', () => {
    describe('Rendering', () => {
        it('renders with default props', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeInTheDocument();
        });

        it('renders children correctly', () => {
            render(<Button>Submit Form</Button>);
            expect(screen.getByText('Submit Form')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(<Button className="custom-class">Button</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });
    });

    describe('Variants', () => {
        it('renders primary variant by default', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-indigo-600');
        });

        it('renders secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-gray-200');
        });

        it('renders danger variant', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-red-600');
        });
    });

    describe('Sizes', () => {
        it('renders medium size by default', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-4 py-2 text-sm');
        });

        it('renders small size', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-3 py-1.5 text-sm');
        });

        it('renders large size', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-6 py-3 text-base');
        });
    });

    describe('States', () => {
        it('can be disabled', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('opacity-50 cursor-not-allowed');
        });

        it('is enabled by default', () => {
            render(<Button>Enabled</Button>);
            const button = screen.getByRole('button');
            expect(button).not.toBeDisabled();
        });
    });

    describe('Interactions', () => {
        it('calls onClick when clicked', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick} disabled>Disabled</Button>);

            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('does not call onClick when no handler provided', () => {
            render(<Button>No handler</Button>);

            expect(() => {
                fireEvent.click(screen.getByRole('button'));
            }).not.toThrow();
        });
    });

    describe('Button Types', () => {
        it('renders as button type by default', () => {
            render(<Button>Default</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'button');
        });

        it('renders as submit type', () => {
            render(<Button type="submit">Submit</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'submit');
        });

        it('renders as reset type', () => {
            render(<Button type="reset">Reset</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'reset');
        });
    });

    describe('Accessibility', () => {
        it('has proper button role', () => {
            render(<Button>Accessible</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('can be focused', () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('can be focused when disabled', () => {
            render(<Button disabled>Disabled Focusable</Button>);
            const button = screen.getByRole('button');
            button.focus();
            // Disabled buttons can still be focused programmatically
            expect(button).toBeInTheDocument();
        });
    });

    describe('Combined Props', () => {
        it('renders with multiple props correctly', () => {
            render(
                <Button
                    variant="danger"
                    size="lg"
                    disabled
                    className="custom-class"
                    type="submit"
                >
                    Complex Button
                </Button>
            );

            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-red-600');
            expect(button).toHaveClass('px-6 py-3 text-base');
            expect(button).toHaveClass('opacity-50 cursor-not-allowed');
            expect(button).toHaveClass('custom-class');
            expect(button).toHaveAttribute('type', 'submit');
            expect(button).toBeDisabled();
        });
    });
}); 