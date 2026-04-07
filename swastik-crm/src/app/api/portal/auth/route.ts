import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const Contact = mongoose.model('Contact');

    // Find contact by email
    const contact = await Contact.findOne({ email: email.toLowerCase() })
      .populate('userid', 'company active phonenumber')
      .lean() as {
        _id: mongoose.Types.ObjectId;
        email: string;
        firstname: string;
        lastname: string;
        password?: string;
        active: number;
        userid: { _id: mongoose.Types.ObjectId; company: string; active: number; phonenumber?: string };
      } | null;

    if (!contact) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (contact.active === 0) {
      return NextResponse.json({ error: 'Your account is inactive. Please contact support.' }, { status: 403 });
    }

    if (!contact.userid || (contact.userid as { active?: number }).active === 0) {
      return NextResponse.json({ error: 'Company account is inactive.' }, { status: 403 });
    }

    // Verify password
    if (!contact.password) {
      return NextResponse.json({ error: 'Password not set. Please contact support.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, contact.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      client: {
        _id: contact.userid._id,
        company: contact.userid.company,
        phonenumber: contact.userid.phonenumber,
        email: contact.email,
        contactName: `${contact.firstname} ${contact.lastname}`,
        contactId: contact._id,
      },
    });
  } catch (err) {
    console.error('Portal auth error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
