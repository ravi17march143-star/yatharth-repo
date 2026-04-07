import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Project = mongoose.model('Project');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const client = searchParams.get('client');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (status) query.status = parseInt(status);
  if (client) query.client = client;
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];

  const total = await Project.countDocuments(query);
  const projects = await Project.find(query)
    .sort({ start_date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('client', 'company')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  return NextResponse.json({
    data: projects,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Project = mongoose.model('Project');

  const body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
  }

  const project = await Project.create({
    ...body,
    addedfrom: session.user.id,
    start_date: body.start_date || new Date(),
    status: body.status || 1,
    progress: 0,
  });

  const populated = await Project.findById(project._id)
    .populate('client', 'company')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Project created successfully' },
    { status: 201 }
  );
}
