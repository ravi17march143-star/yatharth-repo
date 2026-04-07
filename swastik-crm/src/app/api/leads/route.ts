import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Lead = mongoose.model('Lead');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const source = searchParams.get('source');
  const assigned = searchParams.get('assigned');
  const lost = searchParams.get('lost');
  const junk = searchParams.get('junk');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (source) query.source = source;
  if (assigned) query.assigned = assigned;
  if (lost !== null && lost !== '') query.lost = parseInt(lost);
  if (junk !== null && junk !== '') query.junk = parseInt(junk);
  if (search) query.$text = { $search: search };

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort({ dateadded: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('status', 'name color')
    .populate('source', 'name')
    .populate('assigned', 'firstname lastname email profile_image')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  return NextResponse.json({
    data: leads,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Lead = mongoose.model('Lead');

  const body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: 'Lead name is required' }, { status: 400 });
  }
  if (!body.status) {
    return NextResponse.json({ error: 'Lead status is required' }, { status: 400 });
  }

  const lead = await Lead.create({
    ...body,
    hash: uuidv4().replace(/-/g, ''),
    addedfrom: session.user.id,
    dateadded: new Date(),
    lost: 0,
    junk: 0,
  });

  const populated = await Lead.findById(lead._id)
    .populate('status', 'name color')
    .populate('source', 'name')
    .populate('assigned', 'firstname lastname')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Lead created successfully' },
    { status: 201 }
  );
}
