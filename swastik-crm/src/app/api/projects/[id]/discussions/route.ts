import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Project = mongoose.model('Project');
  const project = await Project.findById(params.id)
    .select('discussions')
    .populate('discussions.staff', 'firstname lastname profile_image')
    .lean() as { discussions?: unknown[] } | null;
  return NextResponse.json({ data: project?.discussions || [] });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Project = mongoose.model('Project');
  const body = await req.json();

  const discussion = {
    subject: body.subject,
    content: body.content,
    staff: session.user.id,
    date: new Date(),
    comments: [],
  };

  const project = await Project.findByIdAndUpdate(
    params.id,
    { $push: { discussions: discussion } },
    { new: true }
  ).populate('discussions.staff', 'firstname lastname');

  return NextResponse.json({ data: project }, { status: 201 });
}
