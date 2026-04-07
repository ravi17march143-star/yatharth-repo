import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Lead = mongoose.model('Lead');

  const lead = await Lead.findById(params.id)
    .populate('status', 'name color')
    .populate('source', 'name')
    .populate('assigned', 'firstname lastname email profile_image')
    .populate('addedfrom', 'firstname lastname')
    .populate('client', 'company')
    .lean();

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  return NextResponse.json({ data: lead });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Lead = mongoose.model('Lead');
  const Client = mongoose.model('Client');

  const body = await req.json();

  // Handle convert to client action
  if (body.action === 'convert') {
    const lead = await Lead.findById(params.id).lean() as {
      _id: string;
      name: string;
      company: string;
      email: string;
      phonenumber: string;
      website: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: number;
      default_language: string;
    } | null;

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Create client from lead data
    const client = await Client.create({
      company: lead.company || lead.name,
      phonenumber: lead.phonenumber || '',
      website: lead.website || '',
      address: lead.address || '',
      city: lead.city || '',
      state: lead.state || '',
      zip: lead.zip || '',
      country: lead.country || 0,
      default_language: lead.default_language || 'english',
      leadid: params.id,
      addedfrom: session.user.id,
      datecreated: new Date(),
      active: 1,
    });

    // Update lead with converted status and linked client
    const updatedLead = await Lead.findByIdAndUpdate(
      params.id,
      {
        dateconverted: new Date(),
        client: client._id,
      },
      { new: true }
    ).populate('status', 'name color').lean();

    return NextResponse.json({
      data: { lead: updatedLead, client },
      message: 'Lead converted to client successfully',
    });
  }

  const lead = await Lead.findByIdAndUpdate(params.id, body, { new: true })
    .populate('status', 'name color')
    .populate('source', 'name')
    .populate('assigned', 'firstname lastname')
    .lean();

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  return NextResponse.json({ data: lead, message: 'Lead updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Lead = mongoose.model('Lead');

  const lead = await Lead.findByIdAndDelete(params.id);
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  return NextResponse.json({ message: 'Lead deleted successfully' });
}
