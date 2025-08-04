'use client';

import React, { useState } from 'react';
import {
  useGetProductsQuery,
  useReorderProductsMutation,
  useDeleteProductMutation,
  type Product,
} from '@/service/products.service';
import {
  useLogoutMutation,
  useVerifySessionQuery,
} from '@/service/auth.service';
import Card from '@/layout/card.layout';
import Button from '@/layout/button.layout';
import Modal from '@/layout/modal.layout';
import Loading from '@/layout/loading.layout';
import ProductForm from './product-form.page';

const ProductListPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );
  const [deleteProduct, setDeleteProduct] = useState<Product | undefined>(
    undefined
  );

  const { data: products, isLoading, error } = useGetProductsQuery();
  const productList = Array.isArray(products) ? products : [];
  const { data: session } = useVerifySessionQuery();
  const [reorderProducts] = useReorderProductsMutation();
  const [deleteProductMutation] = useDeleteProductMutation();
  const [logout] = useLogoutMutation();

  const handleReorder = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = productList.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= productList.length) return;

    const newOrder = [...productList];
    const [movedProduct] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, movedProduct);

    try {
      await reorderProducts({ productIds: newOrder.map(p => p.id) }).unwrap();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'data' in error
          ? (error.data as { error?: string })?.error
          : error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : String(error);
      console.error('Failed to reorder products:', errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      await deleteProductMutation(deleteProduct.id).unwrap();
      setDeleteProduct(undefined);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load products</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Product List
              </h1>
              {session?.user?.email && (
                <p className="text-sm text-gray-600 mt-1">
                  Welcome, {session.user.email}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Product
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productList.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first product.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productList.map((product, index) => (
              <Card
                key={product.id}
                id={product.id}
                title={product.name}
                amount={product.amount}
                description={product.comment}
                onEdit={() => setEditingProduct(product)}
                onDelete={() => setDeleteProduct(product)}
                onReorder={direction => handleReorder(product.id, direction)}
                canReorder={index > 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm
          onSuccess={() => {
            setIsAddModalOpen(false);
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(undefined)}
        title="Edit Product"
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            setEditingProduct(undefined);
          }}
          onCancel={() => setEditingProduct(undefined)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(undefined)}
        title="Confirm Delete"
        size="sm"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete &quot;{deleteProduct?.name}&quot;?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteProduct(undefined)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductListPage;
