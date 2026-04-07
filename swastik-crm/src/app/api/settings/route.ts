import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Settings = mongoose.model('Settings');

  const { searchParams } = new URL(req.url);
  const group = searchParams.get('group');

  const query: Record<string, unknown> = {};
  if (group) query.group = group;

  const settings = await Settings.find(query).lean() as Array<{ key: string; value: string; group: string }>;

  // Transform array of {key, value, group} into a flat key-value object
  const settingsObj: Record<string, string> = {};
  for (const setting of settings) {
    settingsObj[setting.key] = setting.value;
  }

  return NextResponse.json({ data: settingsObj });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const Settings = mongoose.model('Settings');

  const body = await req.json();

  if (typeof body !== 'object' || Array.isArray(body) || body === null) {
    return NextResponse.json(
      { error: 'Request body must be a key-value object of settings' },
      { status: 400 }
    );
  }

  // Bulk upsert each setting key-value pair
  const operations = Object.entries(body as Record<string, string>).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { key, value: String(value) } },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return NextResponse.json({ message: 'No settings to update' });
  }

  await Settings.bulkWrite(operations);

  // Return the updated settings as key-value object
  const updated = await Settings.find({
    key: { $in: Object.keys(body as Record<string, string>) },
  }).lean() as Array<{ key: string; value: string }>;

  const updatedObj: Record<string, string> = {};
  for (const setting of updated) {
    updatedObj[setting.key] = setting.value;
  }

  return NextResponse.json({
    data: updatedObj,
    message: `${operations.length} setting(s) updated successfully`,
  });
}
