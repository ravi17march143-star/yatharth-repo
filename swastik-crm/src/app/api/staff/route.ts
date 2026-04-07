import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Staff = mongoose.model('Staff');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const active = searchParams.get('active');
  const role = searchParams.get('role');
  const department = searchParams.get('department');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (active !== null && active !== '') query.active = parseInt(active);
  if (role) query.role = role;
  if (department) query.department = department;
  if (search) query.$or = [
    { firstname: { $regex: search, $options: 'i' } },
    { lastname: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const total = await Staff.countDocuments(query);
  const staff = await Staff.find(query)
    .sort({ datejoined: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password')
    .populate('role', 'name')
    .populate('department', 'name')
    .lean();

  return NextResponse.json({
    data: staff,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Staff = mongoose.model('Staff');

  const body = await req.json();

  if (!body.firstname) {
    return NextResponse.json({ error: 'First name is required' }, { status: 400 });
  }
  if (!body.lastname) {
    return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
  }
  if (!body.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!body.password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  // Check if email already exists
  const existingStaff = await Staff.findOne({ email: body.email.toLowerCase() });
  if (existingStaff) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  // Hash the password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);

  const staff = await Staff.create({
    ...body,
    email: body.email.toLowerCase(),
    password: hashedPassword,
    active: body.active !== undefined ? body.active : 1,
    admin: body.admin || 0,
    isadmin: body.isadmin || 0,
    datejoined: new Date(),
  });

  const populated = await Staff.findById(staff._id)
    .select('-password')
    .populate('role', 'name')
    .populate('department', 'name')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Staff member created successfully' },
    { status: 201 }
  );
}
