import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const CustomField = mongoose.model('CustomField');
  const { searchParams } = new URL(req.url);
  const fieldto = searchParams.get('fieldto');
  const query = fieldto ? { fieldto } : {};
  const fields = await CustomField.find(query).sort({ order: 1 }).lean();
  return NextResponse.json({ data: fields });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const CustomField = mongoose.model('CustomField');
  const body = await req.json();
  if (!body.name || !body.type || !body.fieldto) {
    return NextResponse.json({ error: 'Name, type, and fieldto are required' }, { status: 400 });
  }
  const field = await CustomField.create(body);
  return NextResponse.json({ data: field }, { status: 201 });
}
