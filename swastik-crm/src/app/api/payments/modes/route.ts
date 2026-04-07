import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const PaymentMode = mongoose.model('PaymentMode');
  const modes = await PaymentMode.find({ active: 1 }).sort({ name: 1 }).lean();
  return NextResponse.json({ data: modes });
}
