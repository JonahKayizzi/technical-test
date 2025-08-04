import {
  readProducts,
  writeProducts,
  resetStorage,
  getUserProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/storage';

describe('Storage Functions', () => {
  const mockProduct = {
    id: 'product_123',
    name: 'Test Product',
    amount: 100,
    comment: 'Test comment',
    userId: 'user_test',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockProducts = [
    mockProduct,
    {
      ...mockProduct,
      id: 'product_456',
      name: 'Another Product',
      userId: 'user_test',
    },
    {
      ...mockProduct,
      id: 'product_789',
      name: 'Other User Product',
      userId: 'user_other',
    },
  ];

  beforeEach(async () => {
    // Reset in-memory storage before each test
    await resetStorage();
  });

  describe('readProducts', () => {
    it('should read products from storage', async () => {
      await writeProducts(mockProducts);
      const result = await readProducts();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when storage is empty', async () => {
      const result = await readProducts();
      expect(result).toEqual([]);
    });
  });

  describe('writeProducts', () => {
    it('should write products to storage', async () => {
      await writeProducts(mockProducts);
      const result = await readProducts();
      expect(result).toEqual(mockProducts);
    });

    it('should overwrite existing data', async () => {
      await writeProducts(mockProducts);
      const newProducts = [{ ...mockProduct, id: 'product_new' }];
      await writeProducts(newProducts);
      const result = await readProducts();
      expect(result).toEqual(newProducts);
    });
  });

  describe('getUserProducts', () => {
    it('should return products for specific user', async () => {
      await writeProducts(mockProducts);
      const result = await getUserProducts('user_test');
      expect(result).toEqual([mockProducts[0], mockProducts[1]]);
    });

    it('should return empty array when user has no products', async () => {
      await writeProducts(mockProducts);
      const result = await getUserProducts('user_nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('addProduct', () => {
    it('should add product to storage', async () => {
      const newProduct = { ...mockProduct, id: 'product_new' };
      const result = await addProduct(newProduct);
      expect(result).toEqual(newProduct);

      const allProducts = await readProducts();
      expect(allProducts).toContainEqual(newProduct);
    });

    it('should handle empty storage', async () => {
      const newProduct = { ...mockProduct, id: 'product_new' };
      await addProduct(newProduct);

      const allProducts = await readProducts();
      expect(allProducts).toHaveLength(1);
      expect(allProducts[0].id).toBe('product_new');
    });
  });

  describe('updateProduct', () => {
    it('should update existing product', async () => {
      await writeProducts(mockProducts);

      const updates = { name: 'Updated Product Name', amount: 150 };
      const result = await updateProduct('product_123', updates);

      expect(result).toMatchObject({
        id: 'product_123',
        name: 'Updated Product Name',
        amount: 150,
      });

      const allProducts = await readProducts();
      const updatedProduct = allProducts.find(p => p.id === 'product_123');
      expect(updatedProduct).toMatchObject(updates);
    });

    it('should return null when product not found', async () => {
      await writeProducts(mockProducts);
      const result = await updateProduct('product_nonexistent', {
        name: 'Updated',
      });
      expect(result).toBeNull();
    });

    it('should update only provided fields', async () => {
      // Use a fresh product to avoid conflicts
      const freshProduct = { ...mockProduct, id: 'product_fresh' };
      await writeProducts([freshProduct]);

      const updates = { comment: 'New comment only' };
      const result = await updateProduct('product_fresh', updates);

      expect(result).toMatchObject({
        id: 'product_fresh',
        name: 'Test Product', // Should remain unchanged
        amount: 100, // Should remain unchanged
        comment: 'New comment only',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete existing product', async () => {
      await writeProducts(mockProducts);

      const success = await deleteProduct('product_123');
      expect(success).toBe(true);

      const allProducts = await readProducts();
      // Check that the deleted product is not in the array
      const deletedProduct = allProducts.find(p => p.id === 'product_123');
      expect(deletedProduct).toBeUndefined();
      expect(allProducts).toHaveLength(2);
    });

    it('should return false when product not found', async () => {
      await writeProducts(mockProducts);
      const success = await deleteProduct('product_nonexistent');
      expect(success).toBe(false);
    });
  });
});
