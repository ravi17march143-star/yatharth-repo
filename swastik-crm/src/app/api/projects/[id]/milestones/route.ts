import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Milestone = mongoose.model('Milestone');
  const milestones = await Milestone.find({ project: params.id }).sort({ due_date: 1 }).lean();
  return NextResponse.json({ data: milestones });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Milestone = mongoose.model('Milestone');
  const body = await req.json();
  const milestone = await Milestone.create({ ...body, project: params.id });
  return NextResponse.json({ data: milestone }, { status: 201 });
}
