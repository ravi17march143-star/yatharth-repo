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
  const Proposal = mongoose.model('Proposal');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const client = searchParams.get('client');
  const assigned = searchParams.get('assigned');

  const query: Record<string, unknown> = {};
  if (status) query.status = parseInt(status);
  if (client) query.client = client;
  if (assigned) query.assigned = assigned;

  const total = await Proposal.countDocuments(query);
  const proposals = await Proposal.find(query)
    .sort({ datecreated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('client', 'company')
    .populate('assigned', 'firstname lastname')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  return NextResponse.json({
    data: proposals,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Proposal = mongoose.model('Proposal');

  const body = await req.json();

  if (!body.subject) {
    return NextResponse.json({ error: 'Proposal subject is required' }, { status: 400 });
  }

  // Calculate totals
  let subtotal = 0;
  let total_tax = 0;

  for (const item of body.items || []) {
    const itemTotal = item.qty * item.rate;
    subtotal += itemTotal;
    for (const rate of item.taxrate || []) {
      total_tax += (itemTotal * rate) / 100;
    }
  }

  const discountAmount =
    body.discount_type === 'percent'
      ? (subtotal * (body.discount_percent || 0)) / 100
      : body.discount_total || 0;

  const total = subtotal - discountAmount + total_tax + (body.adjustment || 0);

  const proposal = await Proposal.create({
    ...body,
    subtotal,
    total_tax,
    total,
    discount_total: discountAmount,
    hash: uuidv4().replace(/-/g, ''),
    datecreated: new Date(),
    addedfrom: session.user.id,
    status: body.status || 6, // Draft
  });

  const populated = await Proposal.findById(proposal._id)
    .populate('client', 'company')
    .populate('assigned', 'firstname lastname')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Proposal created successfully' },
    { status: 201 }
  );
}
