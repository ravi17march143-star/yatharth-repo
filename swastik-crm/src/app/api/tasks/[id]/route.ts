import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Task = mongoose.model('Task');

  const task = await Task.findById(params.id)
    .populate('assigned', 'firstname lastname email profile_image')
    .populate('followers', 'firstname lastname email profile_image')
    .populate('project', 'name status')
    .populate('milestone', 'name')
    .populate('addedfrom', 'firstname lastname')
    .populate('invoice', 'number prefix')
    .populate('checklist.addedfrom', 'firstname lastname')
    .populate('checklist.assigned_to', 'firstname lastname')
    .lean();

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  return NextResponse.json({ data: task });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Task = mongoose.model('Task');

  const body = await req.json();

  // If marking as complete, record finish date
  if (body.status === 5) {
    body.datefinished = new Date();
  }

  const task = await Task.findByIdAndUpdate(params.id, body, { new: true })
    .populate('assigned', 'firstname lastname profile_image')
    .populate('project', 'name')
    .populate('milestone', 'name')
    .lean();

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  return NextResponse.json({ data: task, message: 'Task updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Task = mongoose.model('Task');

  const task = await Task.findByIdAndDelete(params.id);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  return NextResponse.json({ message: 'Task deleted successfully' });
}
