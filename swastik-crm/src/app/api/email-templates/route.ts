import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const EmailTemplate = mongoose.model('EmailTemplate');
  const templates = await EmailTemplate.find({}).sort({ name: 1 }).lean();
  return NextResponse.json({ data: templates });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const EmailTemplate = mongoose.model('EmailTemplate');
  const body = await req.json();
  if (!body.name || !body.subject || !body.message) {
    return NextResponse.json({ error: 'Name, subject, and message are required' }, { status: 400 });
  }
  const template = await EmailTemplate.create(body);
  return NextResponse.json({ data: template }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const EmailTemplate = mongoose.model('EmailTemplate');
  const body = await req.json();
  const { _id, ...update } = body;
  const template = await EmailTemplate.findByIdAndUpdate(_id, update, { new: true });
  return NextResponse.json({ data: template });
}
