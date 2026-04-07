import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Contact = mongoose.model('Contact');
  const contacts = await Contact.find({ userid: params.id })
    .sort({ is_primary: -1, firstname: 1 })
    .lean();
  return NextResponse.json({ data: contacts });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Contact = mongoose.model('Contact');
  const body = await req.json();
  const contact = await Contact.create({
    ...body,
    userid: params.id,
    datecreated: new Date(),
  });
  return NextResponse.json({ data: contact }, { status: 201 });
}
