import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) return NextResponse.json({ error: 'Client ID required' }, { status: 400 });

    const Invoice = mongoose.model('Invoice');
    const invoices = await Invoice.find({ client: new mongoose.Types.ObjectId(clientId) })
      .sort({ datecreated: -1 })
      .select('prefix number total status date due_date subtotal total_tax adjustment discount_total')
      .lean();

    return NextResponse.json({ data: invoices });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load invoices' }, { status: 500 });
  }
}
