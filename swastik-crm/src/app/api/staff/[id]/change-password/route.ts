import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only allow users to change their own password (or admins)
  const sessionUser = session.user as { id?: string; isAdmin?: boolean };
  if (sessionUser.id !== params.id && !sessionUser.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();
  const Staff = mongoose.model('Staff');

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const staff = await Staff.findById(params.id).select('+password');
  if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  const isValid = await bcrypt.compare(currentPassword, staff.password);
  if (!isValid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 12);
  await Staff.findByIdAndUpdate(params.id, {
    password: hashed,
    last_password_change: new Date(),
  });

  return NextResponse.json({ success: true });
}
