import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Payment = mongoose.model('Payment');
  const payments = await Payment.find({ invoiceid: params.id })
    .sort({ date: -1 })
    .populate('paymentmode', 'name')
    .lean();

  return NextResponse.json({ data: payments });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Payment = mongoose.model('Payment');
  const Invoice = mongoose.model('Invoice');

  const body = await req.json();
  const { amount, date, payment_mode, note } = body;

  if (!amount || !date) {
    return NextResponse.json({ error: 'Amount and date are required' }, { status: 400 });
  }

  const invoice = await Invoice.findById(params.id);
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

  // Create payment
  const payment = await Payment.create({
    invoiceid: params.id,
    client: invoice.client,
    amount: parseFloat(amount),
    date: new Date(date),
    paymentmode: payment_mode,
    note: note || '',
    addedfrom: session.user.id,
  });

  // Calculate total paid and update invoice status
  const allPayments = await Payment.find({ invoiceid: params.id });
  const totalPaid = allPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

  let newStatus = invoice.status;
  if (totalPaid >= invoice.total) {
    newStatus = 2; // Paid
  } else if (totalPaid > 0) {
    newStatus = 3; // Partial
  }

  await Invoice.findByIdAndUpdate(params.id, { status: newStatus });

  return NextResponse.json({ data: payment, message: 'Payment recorded successfully' }, { status: 201 });
}
