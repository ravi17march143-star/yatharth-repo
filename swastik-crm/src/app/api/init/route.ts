import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/dbInit';

export async function GET() {
  try {
    const result = await initializeDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { success: false, message: 'Initialization failed', error: String(error) },
      { status: 500 }
    );
  }
}
