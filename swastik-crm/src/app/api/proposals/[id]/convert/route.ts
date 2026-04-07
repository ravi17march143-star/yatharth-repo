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
  const Proposal = mongoose.model('Proposal');
  const Invoice = mongoose.model('Invoice');

  const proposal = await Proposal.findById(params.id).lean() as Record<string, unknown> | null;
  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

  const lastInvoice = await Invoice.findOne().sort({ number: -1 }).select('number').lean() as { number?: number } | null;
  const nextNumber = (lastInvoice?.number || 0) + 1;

  const invoiceData = {
    client: proposal.rel_type === 'customer' ? proposal.rel_id : null,
    number: nextNumber,
    prefix: 'INV',
    date: new Date(),
    duedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 1,
    subtotal: proposal.subtotal,
    total: proposal.total,
    discount: proposal.discount,
    discount_percent: proposal.discount_percent,
    items: proposal.items,
    note: proposal.content,
    currency: proposal.currency,
    addedfrom: session.user.id,
    proposal_id: proposal._id,
  };

  const invoice = await Invoice.create(invoiceData);
  await Proposal.findByIdAndUpdate(params.id, { status: 3 }); // Accepted

  return NextResponse.json({ data: invoice, message: 'Proposal converted to invoice successfully' }, { status: 201 });
}
