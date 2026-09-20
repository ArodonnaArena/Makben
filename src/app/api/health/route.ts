import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/api$/, '')}/api/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const payload = await response.text();
    return new NextResponse(payload, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'API unavailable',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
