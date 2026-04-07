import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const KBGroup = mongoose.model('KnowledgeBaseGroup');
  const groups = await KBGroup.find().sort({ name: 1 }).lean();
  return NextResponse.json({ data: groups });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const KBGroup = mongoose.model('KnowledgeBaseGroup');
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const group = await KBGroup.create(body);
  return NextResponse.json({ data: group }, { status: 201 });
}
