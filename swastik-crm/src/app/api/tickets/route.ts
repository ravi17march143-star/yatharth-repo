import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

async function generateTicketKey(Ticket: mongoose.Model<mongoose.Document>): Promise<string> {
  const lastTicket = await Ticket.findOne({ ticketkey: /^TKT-/ })
    .sort({ date: -1 })
    .select('ticketkey')
    .lean() as { ticketkey?: string } | null;

  let nextNum = 1;
  if (lastTicket?.ticketkey) {
    const parts = lastTicket.ticketkey.split('-');
    const num = parseInt(parts[1] || '0', 10);
    if (!isNaN(num)) nextNum = num + 1;
  }

  return `TKT-${String(nextNum).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Ticket = mongoose.model('Ticket');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const client = searchParams.get('client');
  const assigned = searchParams.get('assigned');
  const department = searchParams.get('department');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (client) query.userid = client;
  if (assigned) query.assigned = assigned;
  if (department) query.department = department;
  if (search) query.$or = [
    { subject: { $regex: search, $options: 'i' } },
    { ticketkey: { $regex: search, $options: 'i' } },
    { message: { $regex: search, $options: 'i' } },
  ];

  const total = await Ticket.countDocuments(query);
  const tickets = await Ticket.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userid', 'company')
    .populate('status', 'name color')
    .populate('priority', 'name')
    .populate('assigned', 'firstname lastname profile_image')
    .populate('department', 'name')
    .lean();

  return NextResponse.json({
    data: tickets,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Ticket = mongoose.model('Ticket');

  const body = await req.json();

  if (!body.subject) {
    return NextResponse.json({ error: 'Ticket subject is required' }, { status: 400 });
  }
  if (!body.message) {
    return NextResponse.json({ error: 'Ticket message is required' }, { status: 400 });
  }
  if (!body.userid) {
    return NextResponse.json({ error: 'Client (userid) is required' }, { status: 400 });
  }
  if (!body.priority) {
    return NextResponse.json({ error: 'Priority is required' }, { status: 400 });
  }
  if (!body.status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const ticketkey = await generateTicketKey(Ticket);

  const ticket = await Ticket.create({
    ...body,
    ticketkey,
    date: new Date(),
    addedfrom: session.user.id,
    clientread: 0,
    adminread: 1,
    replies: [],
  });

  const populated = await Ticket.findById(ticket._id)
    .populate('userid', 'company')
    .populate('status', 'name color')
    .populate('priority', 'name')
    .populate('assigned', 'firstname lastname')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Ticket created successfully' },
    { status: 201 }
  );
}
