import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Client = mongoose.model('Client');
  const Contact = mongoose.model('Contact');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const active = searchParams.get('active');

  const query: Record<string, unknown> = {};
  if (search) query.$text = { $search: search };
  if (active !== null && active !== '') query.active = parseInt(active);

  const total = await Client.countDocuments(query);
  const clients = await Client.find(query)
    .sort({ datecreated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Add contact count
  const clientsWithContacts = await Promise.all(
    clients.map(async (client) => {
      const contactCount = await Contact.countDocuments({ client: client._id });
      return { ...client, contactCount };
    })
  );

  return NextResponse.json({
    data: clientsWithContacts,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Client = mongoose.model('Client');
  const Contact = mongoose.model('Contact');

  const body = await req.json();
  const { contact, ...clientData } = body;

  clientData.datecreated = new Date();
  clientData.addedfrom = session.user.id;

  const client = await Client.create(clientData);

  // Create primary contact if provided
  if (contact?.firstname && contact?.email) {
    await Contact.create({
      client: client._id,
      is_primary: 1,
      firstname: contact.firstname,
      lastname: contact.lastname || '',
      email: contact.email,
      phonenumber: contact.phonenumber || '',
      title: contact.title || '',
      active: 1,
      datecreated: new Date(),
    });
  }

  return NextResponse.json({ data: client, message: 'Client created successfully' }, { status: 201 });
}
