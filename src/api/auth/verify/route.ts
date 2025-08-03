import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json(
        {
          error: 'No session found',
        },
        { status: 401 }
      );
    }

    const user = JSON.parse(session.value);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid session',
      },
      { status: 401 }
    );
  }
}
