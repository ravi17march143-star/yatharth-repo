import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // Also allow unauthenticated for portal use
  if (!session) {
    // Check if it's a portal request (no session required)
    await connectDB();
    const TicketPriority = mongoose.model('TicketPriority');
    const priorities = await TicketPriority.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ data: priorities });
  }
  await connectDB();
  const TicketPriority = mongoose.model('TicketPriority');
  const priorities = await TicketPriority.find({}).sort({ name: 1 }).lean();
  return NextResponse.json({ data: priorities });
}
