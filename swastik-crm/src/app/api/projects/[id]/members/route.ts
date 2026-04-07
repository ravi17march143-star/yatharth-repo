import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Project = mongoose.model('Project');
  const { staffId } = await req.json();

  const project = await Project.findByIdAndUpdate(
    params.id,
    { $addToSet: { members: { staff: new mongoose.Types.ObjectId(staffId) } } },
    { new: true }
  ).populate('members.staff', 'firstname lastname email profile_image');

  return NextResponse.json({ data: project });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Project = mongoose.model('Project');
  const { staffId } = await req.json();

  const project = await Project.findByIdAndUpdate(
    params.id,
    { $pull: { members: { staff: new mongoose.Types.ObjectId(staffId) } } },
    { new: true }
  );

  return NextResponse.json({ data: project });
}
