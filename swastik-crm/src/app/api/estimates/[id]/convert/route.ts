import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Estimate = mongoose.model('Estimate');
  const Invoice = mongoose.model('Invoice');

  const estimate = await Estimate.findById(params.id).lean() as Record<string, unknown> | null;
  if (!estimate) return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });

  // Get next invoice number
  const lastInvoice = await Invoice.findOne().sort({ number: -1 }).select('number').lean() as { number?: number } | null;
  const nextNumber = (lastInvoice?.number || 0) + 1;

  const invoiceData = {
    client: estimate.client,
    number: nextNumber,
    prefix: 'INV',
    date: new Date(),
    duedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 1, // Unpaid
    subtotal: estimate.subtotal,
    total: estimate.total,
    discount: estimate.discount,
    discount_percent: estimate.discount_percent,
    tax: estimate.tax,
    items: estimate.items,
    note: estimate.note,
    clientnote: estimate.clientnote,
    terms: estimate.terms,
    currency: estimate.currency,
    addedfrom: session.user.id,
    estimate_id: estimate._id,
  };

  const invoice = await Invoice.create(invoiceData);

  // Update estimate status to invoiced
  await Estimate.findByIdAndUpdate(params.id, { invoiced: 1, invoice_id: invoice._id });

  return NextResponse.json({ data: invoice, message: 'Estimate converted to invoice successfully' }, { status: 201 });
}
