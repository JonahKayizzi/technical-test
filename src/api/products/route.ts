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
    const userProducts = products.filter(product => product.userId === user.id);

    return NextResponse.json({ products: userProducts });
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

    products.push(product);

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productIndex = products.findIndex(
      p => p.id === params.id && p.userId === user.id
    );

    if (productIndex === -1) {
      return NextResponse.json(
        {
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      amount: amount || products[productIndex].amount,
      comment: comment || products[productIndex].comment,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(products[productIndex]);
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const productIndex = products.findIndex(
      p => p.id === params.id && p.userId === user.id
    );

    if (productIndex === -1) {
      return NextResponse.json(
        {
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    products.splice(productIndex, 1);

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
