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
            return NextResponse.json({
                error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const user = JSON.parse(session.value);
        const userProducts = products.filter((product) => product.userId === user.id);

        return NextResponse.json({ products: userProducts });
    } catch {
        return NextResponse.json({
            error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = request.cookies.get('session');

        if (!session) {
            return NextResponse.json({
                error: 'Unauthorized' },
                { status: 401 }
            )
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
        }

        products.push(product)

        return NextResponse.json(product)
    } catch {
        return NextResponse.json({
            error: 'Internal server error' },
            { status: 500 }
        )
    }
}