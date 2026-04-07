import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Note = mongoose.model('Note');
  const { searchParams } = new URL(req.url);
  const rel_id = searchParams.get('rel_id');
  const rel_type = searchParams.get('rel_type');
  const query: Record<string, string> = {};
  if (rel_id) query.rel_id = rel_id;
  if (rel_type) query.rel_type = rel_type;
  const data = await Note.find(query).sort({ dateadded: -1 }).populate('addedfrom', 'firstname lastname').lean();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Note = mongoose.model('Note');
  const body = await req.json();
  const note = await Note.create({ ...body, addedfrom: session.user.id, dateadded: new Date() });
  return NextResponse.json({ data: note }, { status: 201 });
}
