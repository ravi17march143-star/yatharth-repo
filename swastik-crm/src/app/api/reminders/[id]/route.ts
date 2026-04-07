import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Reminder = mongoose.model('Reminder');
  const body = await req.json();
  const reminder = await Reminder.findByIdAndUpdate(params.id, body, { new: true }).lean();
  return NextResponse.json({ data: reminder });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Reminder = mongoose.model('Reminder');
  await Reminder.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
