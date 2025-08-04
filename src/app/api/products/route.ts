import { NextRequest, NextResponse } from 'next/server';
import { getUserProducts, addProduct } from '@/lib/storage';

export async function GET(request: NextRequest) {
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
    const userProducts = await getUserProducts(user.id);

    return NextResponse.json(userProducts);
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { name, amount, comment } = await request.json();

    const product = {
      id: `product_${Date.now()}`,
      name,
      amount,
      comment,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedProduct = await addProduct(product);

    return NextResponse.json(savedProduct);
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
