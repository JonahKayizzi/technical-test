import { api } from './api';

export interface Product {
  id: string;
  name: string;
  amount: number;
  comment?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductRequest {
  name: string;
  amount: number;
  comment?: string;
}

interface UpdateProductRequest {
  id: string;
  name?: string;
  amount?: number;
  comment?: string;
}

interface ReorderProductsRequest {
  productIds: string[];
}

export const productsApi = api.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: product => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ id, ...updates }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    reorderProducts: builder.mutation<void, ReorderProductsRequest>({
      query: data => ({
        url: '/products/reorder',
        method: 'PUT',
        body: { data },
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useReorderProductsMutation,
} = productsApi;
