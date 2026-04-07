import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const Staff = mongoose.model('Staff');
    const body = await req.json();
    const { firstname, lastname, email, password, company } = body;

    if (!firstname || !email || !password) {
      return NextResponse.json({ error: 'First name, email, and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await Staff.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const staff = await Staff.create({
      firstname,
      lastname: lastname || '',
      email: email.toLowerCase(),
      password: hashedPassword,
      isadmin: 1,
      active: 1,
      datejoined: new Date(),
      company: company || '',
    });

    return NextResponse.json({
      message: 'Account created successfully',
      data: { id: staff._id, email: staff.email, firstname: staff.firstname }
    }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
