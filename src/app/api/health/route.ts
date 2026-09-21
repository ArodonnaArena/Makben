import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database is not configured for this deployment.',
        details: 'Set MONGODB_URI and JWT_SECRET in Vercel before using the API routes.',
      },
      { status: 503 }
    );
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Database connected and API routes are available.',
      database: process.env.MONGODB_URI.replace(/:[^@]*@/, ':***@'),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
