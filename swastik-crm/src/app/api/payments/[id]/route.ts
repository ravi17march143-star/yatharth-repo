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

  const payment = await Payment.findById(params.id)
    .populate('invoice', 'number prefix total status client')
    .populate('paymentmethod', 'name')
    .lean();

  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

  return NextResponse.json({ data: payment });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Payment = mongoose.model('Payment');
  const Invoice = mongoose.model('Invoice');

  const body = await req.json();

  const existing = await Payment.findById(params.id);
  if (!existing) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

  const payment = await Payment.findByIdAndUpdate(params.id, body, { new: true })
    .populate('invoice', 'number prefix total status')
    .populate('paymentmethod', 'name')
    .lean();

  // Recalculate invoice status after update
  const invoiceId = (payment as { invoice: { _id: string; total: number } } | null)?.invoice?._id || existing.invoice;
  const invoiceDoc = await Invoice.findById(invoiceId);
  if (invoiceDoc) {
    const allPayments = await Payment.find({ invoice: invoiceId });
    const totalPaid = allPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

    let newStatus: number;
    if (totalPaid <= 0) {
      newStatus = 1;
    } else if (totalPaid < invoiceDoc.total) {
      newStatus = 3;
    } else {
      newStatus = 2;
    }
    await Invoice.findByIdAndUpdate(invoiceId, { status: newStatus });
  }

  return NextResponse.json({ data: payment, message: 'Payment updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Payment = mongoose.model('Payment');
  const Invoice = mongoose.model('Invoice');

  const payment = await Payment.findById(params.id);
  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

  const invoiceId = payment.invoice;
  await Payment.findByIdAndDelete(params.id);

  // Recalculate invoice status after deletion
  const invoiceDoc = await Invoice.findById(invoiceId);
  if (invoiceDoc) {
    const remainingPayments = await Payment.find({ invoice: invoiceId });
    const totalPaid = remainingPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

    let newStatus: number;
    if (totalPaid <= 0) {
      newStatus = 1;
    } else if (totalPaid < invoiceDoc.total) {
      newStatus = 3;
    } else {
      newStatus = 2;
    }
    await Invoice.findByIdAndUpdate(invoiceId, { status: newStatus });
  }

  return NextResponse.json({ message: 'Payment deleted successfully' });
}
