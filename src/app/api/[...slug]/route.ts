import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV !== 'production' ? 'http://localhost:5000/api' : '');

function normalizeTarget(request: NextRequest, slug: string[]) {
  const path = slug.length ? `/${slug.join('/')}` : '/';
  const url = new URL(path + request.nextUrl.search, API_BASE_URL);
  return url;
}

async function proxyRequest(request: NextRequest, slug: string[]) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Backend API is not configured for this deployment. Set BACKEND_API_URL or NEXT_PUBLIC_API_URL.',
      },
      { status: 503 }
    );
  }

  const targetUrl = normalizeTarget(request, slug);
  const method = request.method;
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!['host', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      body = JSON.stringify(await request.json().catch(() => null));
    } else {
      body = await request.arrayBuffer();
    }
  }

  const response = await fetch(targetUrl, {
    method,
    headers,
    body,
  });

  const responseText = await response.text();

  return new NextResponse(responseText, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
    },
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return proxyRequest(request, slug);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return proxyRequest(request, slug);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return proxyRequest(request, slug);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return proxyRequest(request, slug);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return proxyRequest(request, slug);
}
