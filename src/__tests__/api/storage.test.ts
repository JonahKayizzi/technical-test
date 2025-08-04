import { promises as fs } from 'fs';
import path from 'path';
import {
    readProducts,
    writeProducts,
    getUserProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
} from '@/lib/storage';


jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        mkdir: jest.fn(),
        readFile: jest.fn(),
        writeFile: jest.fn(),
    },
}));

const mockFs = fs as jest.Mocked<typeof fs>;

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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('readProducts', () => {
        it('should read products from file', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const result = await readProducts();

            expect(result).toEqual(mockProducts);
            expect(mockFs.readFile).toHaveBeenCalledWith(
                expect.stringMatching(/.*data[\/\\]products\.json$/),
                'utf-8'
            );
        });

        it('should return empty array when file does not exist', async () => {
            mockFs.readFile.mockRejectedValue(new Error('File not found'));

            const result = await readProducts();

            expect(result).toEqual([]);
        });

        it('should handle malformed JSON', async () => {
            mockFs.readFile.mockResolvedValue('invalid json');

            const result = await readProducts();

            expect(result).toEqual([]);
        });
    });

    describe('writeProducts', () => {
        it('should write products to file', async () => {
            mockFs.writeFile.mockResolvedValue(undefined);

            await writeProducts(mockProducts);

            expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/.*data[\/\\]products\.json$/),
                JSON.stringify(mockProducts, null, 2)
            );
        });

        it('should create directory if it does not exist', async () => {
            mockFs.access.mockRejectedValue(new Error('Directory not found'));
            mockFs.writeFile.mockResolvedValue(undefined);

            await writeProducts(mockProducts);

            expect(mockFs.mkdir).toHaveBeenCalledWith(
                expect.stringContaining('data'),
                { recursive: true }
            );
        });
    });

    describe('getUserProducts', () => {
        it('should return products for specific user', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const result = await getUserProducts('user_test');

            expect(result).toHaveLength(2);
            expect(result[0].userId).toBe('user_test');
            expect(result[1].userId).toBe('user_test');
        });

        it('should return empty array when user has no products', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const result = await getUserProducts('user_nonexistent');

            expect(result).toEqual([]);
        });
    });

    describe('addProduct', () => {
        it('should add product to storage', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));
            mockFs.writeFile.mockResolvedValue(undefined);

            const newProduct = {
                id: 'product_new',
                name: 'New Product',
                amount: 200,
                comment: 'New comment',
                userId: 'user_test',
                createdAt: '2023-01-02T00:00:00.000Z',
                updatedAt: '2023-01-02T00:00:00.000Z',
            };

            const result = await addProduct(newProduct);

            expect(result).toEqual(newProduct);
            expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                JSON.stringify([...mockProducts, newProduct], null, 2)
            );
        });

        it('should handle empty storage', async () => {
            mockFs.readFile.mockResolvedValue('[]');
            mockFs.writeFile.mockResolvedValue(undefined);

            const newProduct = {
                id: 'product_new',
                name: 'New Product',
                amount: 200,
                userId: 'user_test',
                createdAt: '2023-01-02T00:00:00.000Z',
                updatedAt: '2023-01-02T00:00:00.000Z',
            };

            const result = await addProduct(newProduct);

            expect(result).toEqual(newProduct);
            expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                JSON.stringify([newProduct], null, 2)
            );
        });
    });

    describe('updateProduct', () => {
        it('should update existing product', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));
            mockFs.writeFile.mockResolvedValue(undefined);

            const updates = { name: 'Updated Product', amount: 150 };
            const result = await updateProduct('product_123', updates);

            expect(result).toEqual({
                ...mockProduct,
                ...updates,
                updatedAt: expect.any(String),
            });
            expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.stringContaining('Updated Product')
            );
        });

        it('should return null when product not found', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const result = await updateProduct('product_nonexistent', { name: 'Updated' });

            expect(result).toBeNull();
        });

        it('should update only provided fields', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));
            mockFs.writeFile.mockResolvedValue(undefined);

            const updates = { name: 'Updated Product' };
            const result = await updateProduct('product_123', updates);

            expect(result?.name).toBe('Updated Product');
            expect(result?.amount).toBe(mockProduct.amount);
            expect(result?.comment).toBe(mockProduct.comment);
        });
    });

    describe('deleteProduct', () => {
        it('should delete existing product', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));
            mockFs.writeFile.mockResolvedValue(undefined);

            const result = await deleteProduct('product_123');

            expect(result).toBe(true);
            expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                JSON.stringify(mockProducts.filter(p => p.id !== 'product_123'), null, 2)
            );
        });

        it('should return false when product not found', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const result = await deleteProduct('product_nonexistent');

            expect(result).toBe(false);
        });
    });

    describe('reorderProducts', () => {
        it('should reorder products successfully', async () => {
            const userProducts = mockProducts.filter(p => p.userId === 'user_test');
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));
            mockFs.writeFile.mockResolvedValue(undefined);

            const newOrder = ['product_456', 'product_123'];
            const result = await reorderProducts('user_test', newOrder);

            expect(result).toBe(true);
            expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.stringContaining('product_456')
            );
        });

        it('should return false for invalid product IDs', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const invalidOrder = ['product_456', 'product_nonexistent'];
            const result = await reorderProducts('user_test', invalidOrder);

            expect(result).toBe(false);
        });

        it('should return false for product IDs from other users', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));

            const otherUserOrder = ['product_789']; // belongs to user_other
            const result = await reorderProducts('user_test', otherUserOrder);

            expect(result).toBe(false);
        });

        it('should preserve products from other users', async () => {
            mockFs.readFile.mockResolvedValue(JSON.stringify(mockProducts));
            mockFs.writeFile.mockResolvedValue(undefined);

            const newOrder = ['product_456', 'product_123'];
            await reorderProducts('user_test', newOrder);

            const writeCall = mockFs.writeFile.mock.calls[0];
            const writtenData = JSON.parse(writeCall[1] as string);

            // Should contain products from both users
            expect(writtenData).toHaveLength(3);
            expect(writtenData.some((p: any) => p.userId === 'user_other')).toBe(true);
        });
    });
}); 