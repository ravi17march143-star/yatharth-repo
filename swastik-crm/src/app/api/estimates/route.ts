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
  const Estimate = mongoose.model('Estimate');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const client = searchParams.get('client');

  const query: Record<string, unknown> = {};
  if (status) query.status = parseInt(status);
  if (client) query.client = client;

  const total = await Estimate.countDocuments(query);
  const estimates = await Estimate.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('client', 'company')
    .populate('sale_agent', 'firstname lastname')
    .lean();

  return NextResponse.json({
    data: estimates,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Estimate = mongoose.model('Estimate');
  const Settings = mongoose.model('Settings');

  const body = await req.json();

  if (!body.client) {
    return NextResponse.json({ error: 'Client is required' }, { status: 400 });
  }

  // Get next estimate number
  const prefixSetting = await Settings.findOne({ key: 'estimate_prefix' });
  const prefix = prefixSetting?.value || 'EST';
  const lastEstimate = await Estimate.findOne().sort({ number: -1 }).select('number');
  const number = (lastEstimate?.number || 0) + 1;

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

  const estimate = await Estimate.create({
    ...body,
    number,
    prefix,
    subtotal,
    total_tax,
    total,
    discount_total: discountAmount,
    hash: uuidv4().replace(/-/g, ''),
    date: body.date || new Date(),
    addedfrom: session.user.id,
    status: body.status || 1, // Draft
  });

  const populated = await Estimate.findById(estimate._id)
    .populate('client', 'company')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Estimate created successfully' },
    { status: 201 }
  );
}
