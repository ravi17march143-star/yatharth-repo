import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Expense = mongoose.model('Expense');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category');
  const client = searchParams.get('client');
  const project = searchParams.get('project');
  const billable = searchParams.get('billable');
  const dateFrom = searchParams.get('date_from');
  const dateTo = searchParams.get('date_to');

  const query: Record<string, unknown> = {};
  if (category) query.category = category;
  if (client) query.client = client;
  if (project) query.project = project;
  if (billable !== null && billable !== '') query.billable = parseInt(billable);
  if (dateFrom || dateTo) {
    const dateQuery: Record<string, Date> = {};
    if (dateFrom) dateQuery.$gte = new Date(dateFrom);
    if (dateTo) dateQuery.$lte = new Date(dateTo);
    query.date = dateQuery;
  }

  const total = await Expense.countDocuments(query);
  const expenses = await Expense.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('category', 'name')
    .populate('client', 'company')
    .populate('project', 'name')
    .populate('paymentmode', 'name')
    .lean();

  return NextResponse.json({
    data: expenses,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Expense = mongoose.model('Expense');

  const body = await req.json();

  if (!body.category) {
    return NextResponse.json({ error: 'Expense category is required' }, { status: 400 });
  }
  if (!body.total || body.total <= 0) {
    return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 });
  }
  if (!body.date) {
    return NextResponse.json({ error: 'Expense date is required' }, { status: 400 });
  }

  const expense = await Expense.create({
    ...body,
    addedfrom: session.user.id,
  });

  const populated = await Expense.findById(expense._id)
    .populate('category', 'name')
    .populate('client', 'company')
    .populate('project', 'name')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Expense created successfully' },
    { status: 201 }
  );
}
