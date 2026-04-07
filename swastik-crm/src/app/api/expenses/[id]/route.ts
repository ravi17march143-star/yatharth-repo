import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Expense = mongoose.model('Expense');

  const expense = await Expense.findById(params.id)
    .populate('category', 'name')
    .populate('client', 'company')
    .populate('project', 'name')
    .populate('paymentmode', 'name')
    .populate('invoice', 'number prefix')
    .lean();

  if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

  return NextResponse.json({ data: expense });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Expense = mongoose.model('Expense');

  const body = await req.json();

  const expense = await Expense.findByIdAndUpdate(params.id, body, { new: true })
    .populate('category', 'name')
    .populate('client', 'company')
    .populate('project', 'name')
    .lean();

  if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

  return NextResponse.json({ data: expense, message: 'Expense updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Expense = mongoose.model('Expense');

  const expense = await Expense.findByIdAndDelete(params.id);
  if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

  return NextResponse.json({ message: 'Expense deleted successfully' });
}
