import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Contract = mongoose.model('Contract');

  const contract = await Contract.findById(params.id)
    .populate('client', 'company address city state zip country phonenumber')
    .populate('contract_type', 'name')
    .populate('project', 'name status')
    .populate('addedfrom', 'firstname lastname')
    .populate('comments.staffid', 'firstname lastname profile_image')
    .populate('renewals.renewed_by', 'firstname lastname')
    .lean();

  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

  return NextResponse.json({ data: contract });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Contract = mongoose.model('Contract');

  const body = await req.json();

  const contract = await Contract.findByIdAndUpdate(params.id, body, { new: true })
    .populate('client', 'company')
    .populate('contract_type', 'name')
    .lean();

  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

  return NextResponse.json({ data: contract, message: 'Contract updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Contract = mongoose.model('Contract');

  const contract = await Contract.findByIdAndDelete(params.id);
  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 });

  return NextResponse.json({ message: 'Contract deleted successfully' });
}
