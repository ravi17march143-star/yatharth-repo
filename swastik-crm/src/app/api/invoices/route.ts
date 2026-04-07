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
  const Invoice = mongoose.model('Invoice');
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const client = searchParams.get('client');

  const query: Record<string, unknown> = {};
  if (status) query.status = parseInt(status);
  if (client) query.client = client;

  const total = await Invoice.countDocuments(query);
  const invoices = await Invoice.find(query)
    .sort({ datecreated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('client', 'company')
    .lean();

  return NextResponse.json({
    data: invoices,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Invoice = mongoose.model('Invoice');
  const Settings = mongoose.model('Settings');

  const body = await req.json();

  // Get next invoice number
  const prefix = (await Settings.findOne({ key: 'invoice_prefix' }))?.value || 'INV';
  const lastInvoice = await Invoice.findOne().sort({ number: -1 }).select('number');
  const number = (lastInvoice?.number || 0) + 1;

  // Calculate totals
  let subtotal = 0;
  let total_tax = 0;

  for (const item of body.items || []) {
    const itemTotal = item.qty * item.rate;
    subtotal += itemTotal;
    for (let i = 0; i < (item.taxrate || []).length; i++) {
      total_tax += (itemTotal * item.taxrate[i]) / 100;
    }
  }

  const discountAmount = body.discount_type === 'percent'
    ? (subtotal * (body.discount_percent || 0)) / 100
    : body.discount_total || 0;

  const total = subtotal - discountAmount + total_tax + (body.adjustment || 0);

  if (!body.client || !body.date) {
    return NextResponse.json({ error: 'client and date are required' }, { status: 400 });
  }

  const created = await Invoice.create({
    ...body,
    number,
    prefix,
    subtotal,
    total_tax,
    total,
    discount_total: discountAmount,
    hash: uuidv4().replace(/-/g, ''),
    datecreated: new Date(),
    addedfrom: session.user.id,
    status: body.status || 6, // Draft
  });

  const invoice = await Invoice.findById(created._id).populate('client', 'company').lean();

  return NextResponse.json({ data: invoice, message: 'Invoice created successfully' }, { status: 201 });
}
