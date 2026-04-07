import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Subscription = mongoose.model('Subscription');
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const total = await Subscription.countDocuments();
  const data = await Subscription.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('client', 'company').lean();
  return NextResponse.json({ data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Subscription = mongoose.model('Subscription');
  const body = await req.json();
  const subscription = await Subscription.create({ ...body, date: new Date() });
  return NextResponse.json({ data: subscription }, { status: 201 });
}
