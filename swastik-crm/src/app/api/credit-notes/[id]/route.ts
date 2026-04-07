import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const CreditNote = mongoose.model('CreditNote');

  const creditNote = await CreditNote.findById(params.id)
    .populate('client', 'company address city state zip country phonenumber')
    .populate('addedfrom', 'firstname lastname')
    .lean();

  if (!creditNote) return NextResponse.json({ error: 'Credit note not found' }, { status: 404 });

  return NextResponse.json({ data: creditNote });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const CreditNote = mongoose.model('CreditNote');

  const body = await req.json();

  // Recalculate totals if items changed
  if (body.items) {
    let subtotal = 0;
    let total_tax = 0;
    for (const item of body.items) {
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

    body.subtotal = subtotal;
    body.total_tax = total_tax;
    body.total = subtotal - discountAmount + total_tax + (body.adjustment || 0);
    body.discount_total = discountAmount;
  }

  const creditNote = await CreditNote.findByIdAndUpdate(params.id, body, { new: true })
    .populate('client', 'company')
    .lean();

  if (!creditNote) return NextResponse.json({ error: 'Credit note not found' }, { status: 404 });

  return NextResponse.json({ data: creditNote, message: 'Credit note updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const CreditNote = mongoose.model('CreditNote');

  const creditNote = await CreditNote.findByIdAndDelete(params.id);
  if (!creditNote) return NextResponse.json({ error: 'Credit note not found' }, { status: 404 });

  return NextResponse.json({ message: 'Credit note deleted successfully' });
}
