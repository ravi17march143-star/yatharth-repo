import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();

  const Lead = mongoose.model('Lead');
  const Client = mongoose.model('Client');
  const Contact = mongoose.model('Contact');

  const lead = await Lead.findById(params.id).lean() as Record<string, unknown> | null;
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  // Create client from lead data
  const client = await Client.create({
    company: (lead.company as string) || (lead.name as string),
    vat: '',
    phonenumber: lead.phonenumber as string | undefined,
    country: lead.country as string | undefined,
    city: lead.city as string | undefined,
    zip: lead.zip as string | undefined,
    state: lead.state as string | undefined,
    address: lead.address as string | undefined,
    website: lead.website as string | undefined,
    leadid: params.id,
    active: 1,
    datecreated: new Date(),
    addedfrom: (session.user as { id: string }).id,
  });

  // Create a primary contact from lead personal info
  const nameParts = ((lead.name as string) || '').split(' ');
  await Contact.create({
    userid: client._id,
    firstname: nameParts[0] || '',
    lastname: nameParts.slice(1).join(' ') || '',
    email: lead.email as string | undefined,
    phonenumber: lead.phonenumber as string | undefined,
    is_primary: 1,
    active: 1,
    datecreated: new Date(),
  });

  // Mark lead as converted and link to new client
  await Lead.findByIdAndUpdate(params.id, {
    dateconverted: new Date(),
    client: client._id,
  });

  return NextResponse.json(
    { data: client, message: 'Lead converted to customer successfully' },
    { status: 201 }
  );
}
