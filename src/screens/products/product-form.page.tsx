'use client';

import React, { useState, useEffect } from 'react';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  type Product,
} from '@/service/products.service';
import Input from '@/layout/input.layout';
import Button from '@/layout/button.layout';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    comment: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        amount: product.amount.toString(),
        comment: product.comment || '',
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount < 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        amount: Number(formData.amount),
        comment: formData.comment.trim() || undefined,
      };

      if (isEditing && product) {
        await updateProduct({
          id: product.id,
          ...productData,
        }).unwrap();
      } else {
        await createProduct(productData).unwrap();
      }

      onSuccess?.();
    } catch (error: unknown) {
      console.error('Failed to save product:', error);
      const errorMessage =
        error && typeof error === 'object' && 'data' in error
          ? (error.data as { error?: string })?.error ||
            'Failed to save product. Please try again.'
          : 'Failed to save product. Please try again.';
      setErrors({
        submit: errorMessage,
      });
    }
  };

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Product Name"
        placeholder="Enter product name"
        value={formData.name}
        onChange={handleInputChange('name')}
        error={errors.name}
        required
        disabled={isLoading}
        maxLength={100}
        showCharacterCount
      />

      <Input
        id="amount"
        name="amount"
        type="number"
        label="Amount"
        placeholder="Enter amount"
        value={formData.amount}
        onChange={handleInputChange('amount')}
        error={errors.amount}
        required
        disabled={isLoading}
        validation={{
          custom: value => {
            const num = Number(value);
            if (num < 0) return 'Amount cannot be negative';
            if (num > 1000000) return 'Amount cannot exceed 1,000,000';
            return null;
          },
        }}
      />

      <Input
        id="comment"
        name="comment"
        type="textarea"
        label="Comment (Optional)"
        placeholder="Add a comment about this product"
        value={formData.comment}
        onChange={handleInputChange('comment')}
        error={errors.comment}
        disabled={isLoading}
        rows={3}
        maxLength={500}
        showCharacterCount
      />

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : isEditing
              ? 'Update Product'
              : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
