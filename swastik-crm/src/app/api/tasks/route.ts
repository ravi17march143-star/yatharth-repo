import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Task = mongoose.model('Task');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const project = searchParams.get('project');
  const status = searchParams.get('status');
  const assigned = searchParams.get('assigned');
  const priority = searchParams.get('priority');
  const milestone = searchParams.get('milestone');
  const billable = searchParams.get('billable');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (project) query.project = project;
  if (status) query.status = parseInt(status);
  if (assigned) query.assigned = assigned;
  if (priority) query.priority = parseInt(priority);
  if (milestone) query.milestone = milestone;
  if (billable !== null && billable !== '') query.billable = parseInt(billable);
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];

  const total = await Task.countDocuments(query);
  const tasks = await Task.find(query)
    .sort({ dateadded: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('assigned', 'firstname lastname profile_image')
    .populate('project', 'name')
    .populate('milestone', 'name')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  return NextResponse.json({
    data: tasks,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Task = mongoose.model('Task');

  const body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: 'Task name is required' }, { status: 400 });
  }

  const task = await Task.create({
    ...body,
    addedfrom: session.user.id,
    dateadded: new Date(),
    startdate: body.startdate || new Date(),
    status: body.status || 1,
    priority: body.priority || 2,
  });

  const populated = await Task.findById(task._id)
    .populate('assigned', 'firstname lastname profile_image')
    .populate('project', 'name')
    .populate('milestone', 'name')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Task created successfully' },
    { status: 201 }
  );
}
