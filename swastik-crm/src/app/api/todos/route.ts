import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import '@/models/Todo';
import '@/models/Goal';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Todo = mongoose.model('Todo');
  const Goal = mongoose.model('Goal');
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'todos';
  if (type === 'goals') {
    const goals = await Goal.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: goals });
  }
  const todos = await Todo.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: todos });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { type, ...data } = body;
  if (type === 'goal') {
    const Goal = mongoose.model('Goal');
    const goal = await Goal.create(data);
    return NextResponse.json({ data: goal }, { status: 201 });
  }
  const Todo = mongoose.model('Todo');
  const todo = await Todo.create({ ...data, staff: session.user.id });
  return NextResponse.json({ data: todo }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, type, ...data } = body;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (type === 'goal') {
    const Goal = mongoose.model('Goal');
    const goal = await Goal.findByIdAndUpdate(id, data, { new: true }).lean();
    return NextResponse.json({ data: goal });
  }
  const Todo = mongoose.model('Todo');
  const todo = await Todo.findByIdAndUpdate(id, data, { new: true }).lean();
  return NextResponse.json({ data: todo });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  if (type === 'goal') {
    const Goal = mongoose.model('Goal');
    await Goal.findByIdAndDelete(id);
  } else {
    const Todo = mongoose.model('Todo');
    await Todo.findByIdAndDelete(id);
  }
  return NextResponse.json({ message: 'Deleted' });
}
