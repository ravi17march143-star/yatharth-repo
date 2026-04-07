import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Ticket = mongoose.model('Ticket');

  const ticket = await Ticket.findById(params.id)
    .populate('userid', 'company phonenumber')
    .populate('contactid', 'firstname lastname email')
    .populate('status', 'name color')
    .populate('priority', 'name')
    .populate('assigned', 'firstname lastname email profile_image')
    .populate('department', 'name')
    .populate('project', 'name')
    .lean();

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  return NextResponse.json({ data: ticket });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Ticket = mongoose.model('Ticket');

  const body = await req.json();

  // Handle add reply action via PUT
  if (body.action === 'reply') {
    const reply = {
      admin: session.user.id,
      message: body.message,
      date: new Date(),
      attachment: body.attachment || null,
      email: body.email || '',
      name: body.name || '',
    };

    const ticket = await Ticket.findByIdAndUpdate(
      params.id,
      {
        $push: { replies: reply },
        lastreply: new Date(),
        adminread: 1,
        clientread: 0,
      },
      { new: true }
    )
      .populate('userid', 'company')
      .populate('status', 'name color')
      .lean();

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    return NextResponse.json({ data: ticket, message: 'Reply added successfully' });
  }

  const ticket = await Ticket.findByIdAndUpdate(params.id, body, { new: true })
    .populate('userid', 'company')
    .populate('status', 'name color')
    .populate('priority', 'name')
    .populate('assigned', 'firstname lastname')
    .lean();

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  return NextResponse.json({ data: ticket, message: 'Ticket updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Ticket = mongoose.model('Ticket');

  const ticket = await Ticket.findByIdAndDelete(params.id);
  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  return NextResponse.json({ message: 'Ticket deleted successfully' });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Ticket = mongoose.model('Ticket');

  const body = await req.json();

  if (!body.message) {
    return NextResponse.json({ error: 'Reply message is required' }, { status: 400 });
  }

  const reply = {
    admin: session.user.id,
    userid: body.userid || null,
    message: body.message,
    date: new Date(),
    attachment: body.attachment || null,
    email: body.email || session.user.email || '',
    name: body.name || session.user.name || '',
  };

  const ticket = await Ticket.findByIdAndUpdate(
    params.id,
    {
      $push: { replies: reply },
      lastreply: new Date(),
      adminread: 1,
      clientread: 0,
    },
    { new: true }
  )
    .populate('userid', 'company')
    .populate('status', 'name color')
    .populate('priority', 'name')
    .lean();

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  return NextResponse.json({ data: ticket, message: 'Reply added successfully' }, { status: 201 });
}
