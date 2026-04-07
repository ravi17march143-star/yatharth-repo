import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Reminder = mongoose.model('Reminder');
  const { searchParams } = new URL(req.url);
  const rel_type = searchParams.get('rel_type');
  const rel_id = searchParams.get('rel_id');
  const query: Record<string, unknown> = {};
  if (rel_type) query.rel_type = rel_type;
  if (rel_id) query.rel_id = rel_id;
  const reminders = await Reminder.find(query).sort({ duedate: 1 }).populate('staff', 'firstname lastname').lean();
  return NextResponse.json({ data: reminders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Reminder = mongoose.model('Reminder');
  const body = await req.json();
  const reminder = await Reminder.create({ ...body, creator: session.user.id });
  return NextResponse.json({ data: reminder }, { status: 201 });
}
