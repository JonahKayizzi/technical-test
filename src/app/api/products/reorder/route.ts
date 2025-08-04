import { NextRequest, NextResponse } from 'next/server';
import { reorderProducts } from '@/lib/storage';

export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('session');

    if (!session) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const user = JSON.parse(session.value);
    const body = await request.json();

    const productIds = body.productIds || body.data?.productIds;

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        {
          error: 'Invalid productIds',
        },
        { status: 400 }
      );
    }

    const success = await reorderProducts(user.id, productIds);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Invalid productIds',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
