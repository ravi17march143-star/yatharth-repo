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
  const Contract = mongoose.model('Contract');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const client = searchParams.get('client');
  const contract_type = searchParams.get('contract_type');
  const trash = searchParams.get('trash');
  const signed = searchParams.get('signed');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (client) query.client = client;
  if (contract_type) query.contract_type = contract_type;
  if (trash !== null && trash !== '') query.trash = parseInt(trash);
  else query.trash = 0; // Default: exclude trashed
  if (signed !== null && signed !== '') query.signed = parseInt(signed);
  if (search) query.$or = [
    { subject: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];

  const total = await Contract.countDocuments(query);
  const contracts = await Contract.find(query)
    .sort({ dateadded: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('client', 'company')
    .populate('contract_type', 'name')
    .populate('project', 'name')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  return NextResponse.json({
    data: contracts,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Contract = mongoose.model('Contract');

  const body = await req.json();

  if (!body.subject) {
    return NextResponse.json({ error: 'Contract subject is required' }, { status: 400 });
  }
  if (!body.client) {
    return NextResponse.json({ error: 'Client is required' }, { status: 400 });
  }
  if (!body.datestart) {
    return NextResponse.json({ error: 'Contract start date is required' }, { status: 400 });
  }

  const contract = await Contract.create({
    ...body,
    hash: uuidv4().replace(/-/g, ''),
    dateadded: new Date(),
    addedfrom: session.user.id,
    trash: 0,
    signed: 0,
    marked_as_signed: 0,
    isexpirynotified: 0,
  });

  const populated = await Contract.findById(contract._id)
    .populate('client', 'company')
    .populate('contract_type', 'name')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Contract created successfully' },
    { status: 201 }
  );
}
