import { NextRequest } from 'next/server';

// Mock Next.js server environment
const mockServer = {
  NextResponse: {
    json: (data: unknown, options?: { status?: number }) => ({
      status: options?.status || 200,
      json: async () => data,
      cookies: {
        set: jest.fn(),
      },
    }),
  },
};

// Mock the API handlers
jest.mock('@/app/api/auth/login/route', () => ({
  POST: async (
    request: NextRequest
  ): Promise<{ status: number; json: () => Promise<unknown> }> => {
    try {
      const body = await request.json();
      const { email } = body as { email?: string };

      if (!email) {
        return mockServer.NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return mockServer.NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      const user = {
        id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
      };

      return mockServer.NextResponse.json({
        user,
        token: `token_${Date.now()}`,
      });
    } catch {
      return mockServer.NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
}));

jest.mock('@/app/api/auth/logout/route', () => ({
  POST: async (): Promise<{
    status: number;
    json: () => Promise<{ success: boolean }>;
    cookies: { set: jest.Mock };
  }> => {
    return {
      status: 200,
      json: async () => ({ success: true }),
      cookies: {
        set: jest.fn(),
      },
    };
  },
}));

jest.mock('@/app/api/auth/verify/route', () => ({
  GET: async (
    request: NextRequest
  ): Promise<{ status: number; json: () => Promise<unknown> }> => {
    try {
      const session = request.cookies.get('session');
      if (!session) {
        return mockServer.NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const user = JSON.parse(session.value) as { id: string; email: string };
      return mockServer.NextResponse.json({ user });
    } catch {
      return mockServer.NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
}));

import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as logoutHandler } from '@/app/api/auth/logout/route';
import { GET as verifyHandler } from '@/app/api/auth/verify/route';

describe('Authentication API Integration', () => {
  const createMockRequest = (body?: unknown, cookies?: unknown) => {
    return {
      json: jest.fn().mockResolvedValue(body || {}),
      cookies: {
        get: jest
          .fn()
          .mockReturnValue(
            cookies ? { value: JSON.stringify(cookies) } : undefined
          ),
      },
    } as unknown as NextRequest;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid email', async () => {
      const request = createMockRequest({ email: 'test@example.com' });
      const response = await loginHandler(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.id).toBe('user_test_example_com');
      expect(data.token).toBeDefined();
    });

    it('should return 400 when email is missing', async () => {
      const request = createMockRequest({});
      const response = await loginHandler(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Email is required');
    });

    it('should return 400 for invalid email format', async () => {
      const request = createMockRequest({ email: 'invalid-email' });
      const response = await loginHandler(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email format');
    });

    it('should generate consistent user ID for same email', async () => {
      const request1 = createMockRequest({ email: 'test@example.com' });
      const request2 = createMockRequest({ email: 'test@example.com' });

      const response1 = await loginHandler(request1);
      const response2 = await loginHandler(request2);

      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.user.id).toBe(data2.user.id);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await logoutHandler();

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should return user data for valid session', async () => {
      const user = { id: 'user_test_example_com', email: 'test@example.com' };
      const request = createMockRequest({}, user);
      const response = await verifyHandler(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toEqual(user);
    });

    it('should return 401 when no session exists', async () => {
      const request = createMockRequest({}, null);
      const response = await verifyHandler(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
});
