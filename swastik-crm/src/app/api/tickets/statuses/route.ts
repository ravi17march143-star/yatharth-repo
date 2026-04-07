import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const TicketStatus = mongoose.model('TicketStatus');
  const statuses = await TicketStatus.find({}).sort({ name: 1 }).lean();
  return NextResponse.json({ data: statuses });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const TicketStatus = mongoose.model('TicketStatus');
  const body = await req.json();
  const status = await TicketStatus.create(body);
  return NextResponse.json({ data: status }, { status: 201 });
}
