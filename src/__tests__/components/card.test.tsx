import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '@/layout/card.layout';

describe('Card', () => {
    const defaultProps = {
        id: 'test-card',
        title: 'Test Product',
    };

    describe('Rendering', () => {
        it('renders with default props', () => {
            render(<Card {...defaultProps} />);
            expect(screen.getByText('Test Product')).toBeInTheDocument();
        });

        it('renders with subtitle', () => {
            render(<Card {...defaultProps} subtitle="Test Subtitle" />);
            expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
        });

        it('renders with description', () => {
            render(<Card {...defaultProps} description="Test description" />);
            expect(screen.getByText('Test description')).toBeInTheDocument();
        });

        it('renders with amount', () => {
            render(<Card {...defaultProps} amount={1234} />);
            expect(screen.getByText('1,234')).toBeInTheDocument();
            expect(screen.getByText('Amount:')).toBeInTheDocument();
        });

        it('renders with children', () => {
            render(
                <Card {...defaultProps}>
                    <div data-testid="custom-content">Custom content</div>
                </Card>
            );
            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(<Card {...defaultProps} className="custom-class" />);
            const card = screen.getByRole('article');
            expect(card).toHaveClass('custom-class');
        });
    });

    describe('States', () => {
            it('shows loading state', () => {
      render(<Card {...defaultProps} loading />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

        it('shows error state', () => {
            render(<Card {...defaultProps} error="Error message" />);
            expect(screen.getByText('Error message')).toBeInTheDocument();
            expect(screen.getByRole('article')).toHaveClass('border-red-300');
        });

        it('shows editing state', () => {
            render(<Card {...defaultProps} isEditing />);
            expect(screen.getByRole('article')).toHaveClass('ring-2');
        });

        it('shows dragging state', () => {
            render(<Card {...defaultProps} isDragging />);
            expect(screen.getByRole('article')).toHaveClass('opacity-50');
        });
    });

    describe('Action Buttons', () => {
        it('renders edit button when onEdit is provided', () => {
            const handleEdit = jest.fn();
            render(<Card {...defaultProps} onEdit={handleEdit} />);

            const editButton = screen.getByLabelText('Edit');
            expect(editButton).toBeInTheDocument();
        });

        it('renders delete button when onDelete is provided', () => {
            const handleDelete = jest.fn();
            render(<Card {...defaultProps} onDelete={handleDelete} />);

            const deleteButton = screen.getByLabelText('Delete');
            expect(deleteButton).toBeInTheDocument();
        });

        it('renders reorder buttons when onReorder is provided', () => {
            const handleReorder = jest.fn();
            render(<Card {...defaultProps} onReorder={handleReorder} />);

            const upButton = screen.getByLabelText('Move up');
            const downButton = screen.getByLabelText('Move down');
            expect(upButton).toBeInTheDocument();
            expect(downButton).toBeInTheDocument();
        });

        it('calls onEdit when edit button is clicked', () => {
            const handleEdit = jest.fn();
            render(<Card {...defaultProps} onEdit={handleEdit} />);

            fireEvent.click(screen.getByLabelText('Edit'));
            expect(handleEdit).toHaveBeenCalledTimes(1);
        });

        it('calls onDelete when delete button is clicked', () => {
            const handleDelete = jest.fn();
            render(<Card {...defaultProps} onDelete={handleDelete} />);

            fireEvent.click(screen.getByLabelText('Delete'));
            expect(handleDelete).toHaveBeenCalledTimes(1);
        });

        it('calls onReorder with "up" when up button is clicked', () => {
            const handleReorder = jest.fn();
            render(<Card {...defaultProps} onReorder={handleReorder} />);

            fireEvent.click(screen.getByLabelText('Move up'));
            expect(handleReorder).toHaveBeenCalledWith('up');
        });

        it('calls onReorder with "down" when down button is clicked', () => {
            const handleReorder = jest.fn();
            render(<Card {...defaultProps} onReorder={handleReorder} />);

            fireEvent.click(screen.getByLabelText('Move down'));
            expect(handleReorder).toHaveBeenCalledWith('down');
        });
    });

    describe('Button Visibility', () => {
        it('hides edit button when canEdit is false', () => {
            render(<Card {...defaultProps} onEdit={jest.fn()} canEdit={false} />);
            expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
        });

        it('hides delete button when canDelete is false', () => {
            render(<Card {...defaultProps} onDelete={jest.fn()} canDelete={false} />);
            expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
        });

        it('hides reorder buttons when canReorder is false', () => {
            render(<Card {...defaultProps} onReorder={jest.fn()} canReorder={false} />);
            expect(screen.queryByLabelText('Move up')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Move down')).not.toBeInTheDocument();
        });

        it('hides edit button when onEdit is not provided', () => {
            render(<Card {...defaultProps} canEdit />);
            expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
        });

        it('hides delete button when onDelete is not provided', () => {
            render(<Card {...defaultProps} canDelete />);
            expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
        });

        it('hides reorder buttons when onReorder is not provided', () => {
            render(<Card {...defaultProps} canReorder />);
            expect(screen.queryByLabelText('Move up')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Move down')).not.toBeInTheDocument();
        });
    });

    describe('Disabled States', () => {
        it('disables buttons when loading', () => {
            const handleEdit = jest.fn();
            const handleDelete = jest.fn();
            const handleReorder = jest.fn();

            render(
                <Card
                    {...defaultProps}
                    loading
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReorder={handleReorder}
                />
            );

            const editButton = screen.getByLabelText('Edit');
            const deleteButton = screen.getByLabelText('Delete');
            const upButton = screen.getByLabelText('Move up');
            const downButton = screen.getByLabelText('Move down');

            expect(editButton).toBeDisabled();
            expect(deleteButton).toBeDisabled();
            expect(upButton).toBeDisabled();
            expect(downButton).toBeDisabled();
        });

        it('does not call handlers when loading', () => {
            const handleEdit = jest.fn();
            const handleDelete = jest.fn();
            const handleReorder = jest.fn();

            render(
                <Card
                    {...defaultProps}
                    loading
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReorder={handleReorder}
                />
            );

            fireEvent.click(screen.getByLabelText('Edit'));
            fireEvent.click(screen.getByLabelText('Delete'));
            fireEvent.click(screen.getByLabelText('Move up'));

            expect(handleEdit).not.toHaveBeenCalled();
            expect(handleDelete).not.toHaveBeenCalled();
            expect(handleReorder).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('has proper article role', () => {
            render(<Card {...defaultProps} />);
            expect(screen.getByRole('article')).toBeInTheDocument();
        });

        it('has proper aria-label', () => {
            render(<Card {...defaultProps} />);
            const article = screen.getByRole('article');
            expect(article).toHaveAttribute('aria-label', 'Product: Test Product');
        });

        it('has proper button labels', () => {
            render(
                <Card
                    {...defaultProps}
                    onEdit={jest.fn()}
                    onDelete={jest.fn()}
                    onReorder={jest.fn()}
                />
            );

            expect(screen.getByLabelText('Edit')).toBeInTheDocument();
            expect(screen.getByLabelText('Delete')).toBeInTheDocument();
            expect(screen.getByLabelText('Move up')).toBeInTheDocument();
            expect(screen.getByLabelText('Move down')).toBeInTheDocument();
        });
    });

    describe('Amount Formatting', () => {
        it('formats large numbers with commas', () => {
            render(<Card {...defaultProps} amount={1234567} />);
            expect(screen.getByText('1,234,567')).toBeInTheDocument();
        });

        it('formats zero correctly', () => {
            render(<Card {...defaultProps} amount={0} />);
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('formats decimal numbers', () => {
            render(<Card {...defaultProps} amount={1234.56} />);
            expect(screen.getByText('1,234.56')).toBeInTheDocument();
        });
    });

    describe('Combined Props', () => {
        it('renders with all props correctly', () => {
            const handleEdit = jest.fn();
            const handleDelete = jest.fn();
            const handleReorder = jest.fn();

            render(
                <Card
                    {...defaultProps}
                    subtitle="Test Subtitle"
                    description="Test description"
                    amount={1234}
                    loading
                    error="Test error"
                    isEditing
                    isDragging
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReorder={handleReorder}
                    className="custom-class"
                >
                    <div data-testid="custom-content">Custom content</div>
                </Card>
            );

            // Check all content is rendered
            expect(screen.getByText('Test Product')).toBeInTheDocument();
            expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
            expect(screen.getByText('Test description')).toBeInTheDocument();
            expect(screen.getByText('1,234')).toBeInTheDocument();
            expect(screen.getByText('Test error')).toBeInTheDocument();
            expect(screen.getByTestId('custom-content')).toBeInTheDocument();

            // Check all buttons are rendered
            expect(screen.getByLabelText('Edit')).toBeInTheDocument();
            expect(screen.getByLabelText('Delete')).toBeInTheDocument();
            expect(screen.getByLabelText('Move up')).toBeInTheDocument();
            expect(screen.getByLabelText('Move down')).toBeInTheDocument();

            // Check classes are applied
            const article = screen.getByRole('article');
            expect(article).toHaveClass('custom-class');
            expect(article).toHaveClass('ring-2');
            expect(article).toHaveClass('opacity-50');
        });
    });
}); 