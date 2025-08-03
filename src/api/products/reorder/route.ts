import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  amount: number;
  comment: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const products: Product[] = [];

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
    const { productIds } = await request.json();

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        {
          error: 'Invalid productIds',
        },
        { status: 400 }
      );
    }

    const userProducts = products.filter(p => p.userId === user.id);

    // verify all productIds belong to the user
    const validProductIds = userProducts.map(p => p.id);
    const allValid = productIds.every((id: string) =>
      validProductIds.includes(id)
    );

    if (!allValid) {
      return NextResponse.json(
        {
          error: 'Invalid productIds',
        },
        { status: 400 }
      );
    }

    // reorder products
    const reorderedProducts = productIds
      .map(id => userProducts.find(p => p.id === id))
      .filter(Boolean);

    // update products
    const otherProducts = products.filter(p => p.userId !== user.id);
    const updatedProducts = [...otherProducts, ...reorderedProducts];

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
