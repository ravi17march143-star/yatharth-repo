import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Payment = mongoose.model('Payment');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const invoice = searchParams.get('invoice');

  const query: Record<string, unknown> = {};
  if (invoice) query.invoice = invoice;

  const total = await Payment.countDocuments(query);
  const payments = await Payment.find(query)
    .sort({ datecreated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('invoice', 'number prefix total status client')
    .populate('paymentmethod', 'name')
    .lean();

  return NextResponse.json({
    data: payments,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Payment = mongoose.model('Payment');
  const Invoice = mongoose.model('Invoice');

  const body = await req.json();

  if (!body.invoice) {
    return NextResponse.json({ error: 'Invoice is required' }, { status: 400 });
  }
  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
  }
  if (!body.date) {
    return NextResponse.json({ error: 'Payment date is required' }, { status: 400 });
  }

  const invoice = await Invoice.findById(body.invoice);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const payment = await Payment.create({
    ...body,
    datecreated: new Date(),
  });

  // Recalculate total paid and update invoice status
  const allPayments = await Payment.find({ invoice: body.invoice });
  const totalPaid = allPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

  let newStatus: number;
  if (totalPaid <= 0) {
    // Unpaid
    newStatus = 1;
  } else if (totalPaid < invoice.total) {
    // Partially paid
    newStatus = 3;
  } else {
    // Paid
    newStatus = 2;
  }

  await Invoice.findByIdAndUpdate(body.invoice, { status: newStatus });

  const populated = await Payment.findById(payment._id)
    .populate('invoice', 'number prefix total status')
    .populate('paymentmethod', 'name')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Payment recorded successfully' },
    { status: 201 }
  );
}
