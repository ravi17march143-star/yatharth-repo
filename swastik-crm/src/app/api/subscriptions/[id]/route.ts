import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Subscription = mongoose.model('Subscription');
  const sub = await Subscription.findById(params.id).populate('client', 'company').lean();
  if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: sub });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Subscription = mongoose.model('Subscription');
  const body = await req.json();
  const sub = await Subscription.findByIdAndUpdate(params.id, body, { new: true }).populate('client', 'company').lean();
  if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: sub });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Subscription = mongoose.model('Subscription');
  await Subscription.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
