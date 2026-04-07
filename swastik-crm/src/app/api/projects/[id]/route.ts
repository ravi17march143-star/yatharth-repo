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
  const Task = mongoose.model('Task');
  const Milestone = mongoose.model('Milestone');

  const project = await Project.findById(params.id)
    .populate('client', 'company phonenumber website address city state zip country')
    .populate('addedfrom', 'firstname lastname email')
    .populate('members.staff', 'firstname lastname email profile_image')
    .lean();

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  // Fetch tasks and milestones separately
  const tasks = await Task.find({ project: params.id })
    .populate('assigned', 'firstname lastname profile_image')
    .sort({ dateadded: -1 })
    .lean();

  const milestones = await Milestone.find({ project: params.id })
    .sort({ order: 1 })
    .lean();

  // Calculate task progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: { status: number }) => t.status === 5).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return NextResponse.json({
    data: {
      ...project,
      tasks,
      milestones,
      taskStats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: tasks.filter((t: { status: number }) => t.status === 2).length,
        notStarted: tasks.filter((t: { status: number }) => t.status === 1).length,
        calculatedProgress: progress,
      },
    },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Project = mongoose.model('Project');

  const body = await req.json();

  const project = await Project.findByIdAndUpdate(params.id, body, { new: true })
    .populate('client', 'company')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  return NextResponse.json({ data: project, message: 'Project updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Project = mongoose.model('Project');

  const project = await Project.findByIdAndDelete(params.id);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  return NextResponse.json({ message: 'Project deleted successfully' });
}
