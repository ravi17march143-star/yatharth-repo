import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Invoice = mongoose.model('Invoice');
  const Payment = mongoose.model('Payment');

  const invoice = await Invoice.findById(params.id).populate('client', 'company address city state zip country').lean();
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

  const payments = await Payment.find({ invoice: params.id }).lean();
  const totalPaid = payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

  return NextResponse.json({ data: { ...invoice, payments, totalPaid, balance: (invoice as { total: number }).total - totalPaid } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Invoice = mongoose.model('Invoice');
  const body = await req.json();

  // Recalculate if items changed
  if (body.items) {
    let subtotal = 0;
    let total_tax = 0;
    for (const item of body.items) {
      const itemTotal = item.qty * item.rate;
      subtotal += itemTotal;
      for (const rate of (item.taxrate || [])) {
        total_tax += (itemTotal * rate) / 100;
      }
    }
    const discountAmount = body.discount_type === 'percent'
      ? (subtotal * (body.discount_percent || 0)) / 100
      : body.discount_total || 0;

    body.subtotal = subtotal;
    body.total_tax = total_tax;
    body.total = subtotal - discountAmount + total_tax + (body.adjustment || 0);
    body.discount_total = discountAmount;
  }

  const invoice = await Invoice.findByIdAndUpdate(params.id, body, { new: true });
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

  return NextResponse.json({ data: invoice, message: 'Invoice updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Invoice = mongoose.model('Invoice');
  await Invoice.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Invoice deleted successfully' });
}
