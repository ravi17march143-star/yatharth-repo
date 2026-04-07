import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  // In real implementation, verify portal session
  // For now, return all projects (demo)
  try {
    await connectDB();
    const Project = mongoose.model('Project');
    const projects = await Project.find({ status: { $ne: 'cancelled' } })
      .select('name status progress start_date deadline description')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data: projects });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
