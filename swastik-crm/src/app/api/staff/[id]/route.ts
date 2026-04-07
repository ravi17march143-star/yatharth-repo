import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Staff = mongoose.model('Staff');

  const staff = await Staff.findById(params.id)
    .select('-password')
    .populate('role', 'name permissions')
    .populate('department', 'name')
    .lean();

  if (!staff) return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });

  return NextResponse.json({ data: staff });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Staff = mongoose.model('Staff');

  const body = await req.json();

  // If updating password, hash it
  if (body.password) {
    const saltRounds = 12;
    body.password = await bcrypt.hash(body.password, saltRounds);
    body.last_password_change = new Date();
  } else {
    // Never allow clearing password via update
    delete body.password;
  }

  // Normalize email if provided
  if (body.email) {
    body.email = body.email.toLowerCase();

    // Check email uniqueness if changing
    const existingStaff = await Staff.findOne({ email: body.email, _id: { $ne: params.id } });
    if (existingStaff) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
  }

  const staff = await Staff.findByIdAndUpdate(params.id, body, { new: true })
    .select('-password')
    .populate('role', 'name')
    .populate('department', 'name')
    .lean();

  if (!staff) return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });

  return NextResponse.json({ data: staff, message: 'Staff member updated successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Staff = mongoose.model('Staff');

  // Soft delete: set active = 0 instead of removing the record
  const staff = await Staff.findByIdAndUpdate(
    params.id,
    { active: 0 },
    { new: true }
  ).select('-password').lean();

  if (!staff) return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });

  return NextResponse.json({ data: staff, message: 'Staff member deactivated successfully' });
}
