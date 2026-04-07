import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) return NextResponse.json({ error: 'Client ID required' }, { status: 400 });

    const Ticket = mongoose.model('Ticket');
    const tickets = await Ticket.find({ userid: new mongoose.Types.ObjectId(clientId) })
      .sort({ date: -1 })
      .populate('status', 'name color')
      .populate('priority', 'name')
      .lean();

    return NextResponse.json({ data: tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { clientId, subject, message, priority } = body;

    if (!clientId || !subject || !message) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const Ticket = mongoose.model('Ticket');
    const TicketStatus = mongoose.model('TicketStatus');

    // Get default "Open" status
    const openStatus = await TicketStatus.findOne({ name: 'Open' }).lean() as { _id: mongoose.Types.ObjectId } | null;

    // Get default priority if not provided
    let priorityId = priority;
    if (!priorityId) {
      const TicketPriority = mongoose.model('TicketPriority');
      const medPriority = await TicketPriority.findOne({ name: 'Medium' }).lean() as { _id: mongoose.Types.ObjectId } | null;
      priorityId = medPriority?._id;
    }

    // Generate ticket key
    const lastTicket = await Ticket.findOne().sort({ date: -1 }).select('ticketkey').lean() as { ticketkey?: string } | null;
    let nextNum = 1;
    if (lastTicket?.ticketkey) {
      const parts = lastTicket.ticketkey.split('-');
      const num = parseInt(parts[1] || '0', 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    const ticketkey = `TKT-${String(nextNum).padStart(4, '0')}`;

    const ticket = await Ticket.create({
      userid: new mongoose.Types.ObjectId(clientId),
      subject,
      message,
      priority: priorityId,
      status: openStatus?._id,
      ticketkey,
      date: new Date(),
      clientread: 1,
      adminread: 0,
      replies: [],
    });

    return NextResponse.json({ data: ticket, message: 'Ticket submitted successfully' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
