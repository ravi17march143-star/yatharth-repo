import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const KnowledgeBase = mongoose.model('KnowledgeBase');

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const group = searchParams.get('group');
  const active = searchParams.get('active');
  const staff_article = searchParams.get('staff_article');
  const search = searchParams.get('search') || '';

  const query: Record<string, unknown> = {};
  if (group) query.articlegroup = group;
  if (active !== null && active !== '') query.active = parseInt(active);
  if (staff_article !== null && staff_article !== '') query.staff_article = parseInt(staff_article);
  if (search) query.$text = { $search: search };

  const total = await KnowledgeBase.countDocuments(query);
  const articles = await KnowledgeBase.find(query)
    .sort({ article_order: 1, dateadded: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('articlegroup', 'name')
    .lean();

  return NextResponse.json({
    data: articles,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const KnowledgeBase = mongoose.model('KnowledgeBase');

  const body = await req.json();

  if (!body.title) {
    return NextResponse.json({ error: 'Article title is required' }, { status: 400 });
  }
  if (!body.articlegroup) {
    return NextResponse.json({ error: 'Article group is required' }, { status: 400 });
  }

  // Auto-generate slug from title
  let slug = generateSlug(body.title);

  // Ensure slug uniqueness
  const existing = await KnowledgeBase.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const article = await KnowledgeBase.create({
    ...body,
    slug,
    dateadded: new Date(),
    lastmodified: new Date(),
    active: body.active !== undefined ? body.active : 1,
    views: 0,
    thumbs_up: 0,
    thumbs_down: 0,
  });

  const populated = await KnowledgeBase.findById(article._id)
    .populate('articlegroup', 'name')
    .lean();

  return NextResponse.json(
    { data: populated, message: 'Article created successfully' },
    { status: 201 }
  );
}
