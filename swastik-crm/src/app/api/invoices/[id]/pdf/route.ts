import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Invoice = mongoose.model('Invoice');

  const invoice = await Invoice.findById(params.id)
    .populate('client', 'company address city state zip country vat')
    .populate('items.tax', 'name taxrate')
    .lean() as Record<string, unknown> | null;

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Return invoice data for client-side PDF generation
  return NextResponse.json({ data: invoice });
}
