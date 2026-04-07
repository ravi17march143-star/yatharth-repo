import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Department = mongoose.model('Department');
  const dept = await Department.findById(params.id).lean();
  if (!dept) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: dept });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Department = mongoose.model('Department');
  const body = await req.json();
  const dept = await Department.findByIdAndUpdate(params.id, body, { new: true }).lean();
  if (!dept) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: dept });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Department = mongoose.model('Department');
  await Department.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
