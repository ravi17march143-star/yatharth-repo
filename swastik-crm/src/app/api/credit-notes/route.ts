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
  const CreditNote = mongoose.model('CreditNote');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const client = searchParams.get('client');

  const query: Record<string, unknown> = {};
  if (status) query.status = parseInt(status);
  if (client) query.client = client;

  const total = await CreditNote.countDocuments(query);
  const creditNotes = await CreditNote.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('client', 'company')
    .lean();

  return NextResponse.json({
    data: creditNotes,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const CreditNote = mongoose.model('CreditNote');
  const Settings = mongoose.model('Settings');

  const body = await req.json();

  if (!body.client) {
    return NextResponse.json({ error: 'Client is required' }, { status: 400 });
  }
  if (!body.date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  // Get next credit note number
  const prefixSetting = await Settings.findOne({ key: 'creditnote_prefix' });
  const prefix = prefixSetting?.value || 'CN';
  const lastCN = await CreditNote.findOne().sort({ number: -1 }).select('number');
  const number = (lastCN?.number || 0) + 1;

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

  const creditNote = await CreditNote.create({
    ...body,
    number,
    prefix,
    subtotal,
    total_tax,
    total,
    discount_total: discountAmount,
    hash: uuidv4().replace(/-/g, ''),
    addedfrom: session.user.id,
    status: body.status || 1,
  });

  const populated = await CreditNote.findById(creditNote._id)
    .populate('client', 'company')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Credit note created successfully' },
    { status: 201 }
  );
}
