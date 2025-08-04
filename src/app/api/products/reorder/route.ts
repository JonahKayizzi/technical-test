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

        // Handle both direct productIds and wrapped data structure
        const productIds = body.productIds || body.data?.productIds;

        if (!Array.isArray(productIds)) {
            return NextResponse.json(
                {
                    error: 'Invalid productIds',
                },
                { status: 400 }
            );
        }

        console.log('Reorder request:', { userId: user.id, productIds });

        const success = await reorderProducts(user.id, productIds);

        if (!success) {
            console.log('Reorder failed: Invalid productIds');
            return NextResponse.json(
                {
                    error: 'Invalid productIds',
                },
                { status: 400 }
            );
        }

        console.log('Reorder successful');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
