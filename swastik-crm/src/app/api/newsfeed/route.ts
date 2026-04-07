import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Newsfeed = mongoose.model('Newsfeed');
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const total = await Newsfeed.countDocuments({});
  const posts = await Newsfeed.find({})
    .sort({ datepublished: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('staff', 'firstname lastname profile_image')
    .lean();

  return NextResponse.json({ data: posts, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Newsfeed = mongoose.model('Newsfeed');
  const body = await req.json();
  if (!body.message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  const post = await Newsfeed.create({
    message: body.message,
    staff: session.user.id,
    datepublished: new Date(),
    pin: body.pin || 0,
    likes: [],
    comments: [],
  });

  const populated = await Newsfeed.findById(post._id)
    .populate('staff', 'firstname lastname profile_image')
    .lean();

  return NextResponse.json({ data: populated }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const Newsfeed = mongoose.model('Newsfeed');
  const body = await req.json();
  const { id, action, comment } = body;

  if (action === 'like') {
    const staffId = new mongoose.Types.ObjectId(session.user.id);
    const post = await Newsfeed.findById(id);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const alreadyLiked = post.likes?.some((l: mongoose.Types.ObjectId) => l.toString() === session.user.id);
    if (alreadyLiked) {
      await Newsfeed.findByIdAndUpdate(id, { $pull: { likes: staffId } });
    } else {
      await Newsfeed.findByIdAndUpdate(id, { $push: { likes: staffId } });
    }
    const updated = await Newsfeed.findById(id).populate('staff', 'firstname lastname').lean();
    return NextResponse.json({ data: updated });
  }

  if (action === 'comment') {
    const newComment = {
      staff: new mongoose.Types.ObjectId(session.user.id),
      content: comment,
      date: new Date(),
    };
    const updated = await Newsfeed.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }
    ).populate('staff', 'firstname lastname').populate('comments.staff', 'firstname lastname').lean();
    return NextResponse.json({ data: updated });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
