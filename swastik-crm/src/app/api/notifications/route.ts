import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Notification = mongoose.model('Notification');
  const notifications = await Notification.find({ touserid: session.user.id }).sort({ date: -1 }).limit(20).lean();
  const unreadCount = await Notification.countDocuments({ touserid: session.user.id, isread: 0 });
  return NextResponse.json({ data: notifications, unreadCount });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Notification = mongoose.model('Notification');
  await Notification.updateMany({ touserid: session.user.id }, { isread: 1 });
  return NextResponse.json({ message: 'All notifications marked as read' });
}
