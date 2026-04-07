import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Announcement = mongoose.model('Announcement');
  const data = await Announcement.find({ showtostaff: 1 }).sort({ dateadded: -1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Announcement = mongoose.model('Announcement');
  const body = await req.json();
  const announcement = await Announcement.create({ ...body, userid: session.user.id, dateadded: new Date() });
  return NextResponse.json({ data: announcement }, { status: 201 });
}
