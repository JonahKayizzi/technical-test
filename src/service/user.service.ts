import { api } from './api';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/user/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetCurrentUserQuery } = userApi;
