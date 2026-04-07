import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Client = mongoose.model('Client');
  const Contact = mongoose.model('Contact');
  const Invoice = mongoose.model('Invoice');
  const Project = mongoose.model('Project');
  const Ticket = mongoose.model('Ticket');
  const Contract = mongoose.model('Contract');

  const client = await Client.findById(params.id).lean();
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const [contacts, invoices, projects, tickets, contracts] = await Promise.all([
    Contact.find({ client: params.id }).lean(),
    Invoice.find({ client: params.id }).sort({ datecreated: -1 }).limit(10).lean(),
    Project.find({ client: params.id }).sort({ createdAt: -1 }).limit(10).lean(),
    Ticket.find({ userid: params.id }).sort({ date: -1 }).limit(10).lean(),
    Contract.find({ client: params.id }).sort({ dateadded: -1 }).limit(10).lean(),
  ]);

  return NextResponse.json({ data: { ...client, contacts, invoices, projects, tickets, contracts } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Client = mongoose.model('Client');

  const body = await req.json();
  const client = await Client.findByIdAndUpdate(params.id, body, { new: true });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  return NextResponse.json({ data: client, message: 'Client updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Client = mongoose.model('Client');

  // Soft delete
  const client = await Client.findByIdAndUpdate(params.id, { active: 0 }, { new: true });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  return NextResponse.json({ message: 'Client deleted successfully' });
}
