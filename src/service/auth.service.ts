import { api } from "./api";

interface LoginRequest {
    email: string;
}

interface LoginResponse {
    user: {
        id: string;
        email: string;
    }
    token: string;
}

interface LogoutResponse {
    success: boolean;
}

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        verifySession: builder.query<{user: { id: string; email: string; }}, void>({
            query: () => '/auth/verify',
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation, useVerifySessionQuery } = authApi;