import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Note = mongoose.model('Note');
  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Note deleted' });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Note = mongoose.model('Note');
  const body = await req.json();
  const note = await Note.findByIdAndUpdate(params.id, body, { new: true }).lean();
  return NextResponse.json({ data: note });
}
