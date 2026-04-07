import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const KnowledgeBase = mongoose.model('KnowledgeBase');

  const article = await KnowledgeBase.findById(params.id)
    .populate('articlegroup', 'name')
    .lean();

  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  return NextResponse.json({ data: article });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const KnowledgeBase = mongoose.model('KnowledgeBase');

  const body = await req.json();

  // Always update lastmodified on edit
  body.lastmodified = new Date();

  const article = await KnowledgeBase.findByIdAndUpdate(params.id, body, { new: true })
    .populate('articlegroup', 'name')
    .lean();

  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  return NextResponse.json({ data: article, message: 'Article updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const KnowledgeBase = mongoose.model('KnowledgeBase');

  const article = await KnowledgeBase.findByIdAndDelete(params.id);
  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  return NextResponse.json({ message: 'Article deleted successfully' });
}
