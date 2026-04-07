'use client';

import { useState, useEffect } from 'react';
import { Rss, Heart, MessageCircle, Pin, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

interface Comment {
  _id: string;
  staffid: string;
  staffname: string;
  content: string;
  dateadded: string;
}

interface Post {
  _id: string;
  staffid: string;
  staffname: string;
  message: string;
  dateadded: string;
  pinned: number;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

function PostSkeleton() {
  return (
    <div className="card card-body animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-100 rounded w-1/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export default function NewsfeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/newsfeed')
      .then(r => r.json())
      .then(d => { setPosts(d.data || []); setLoading(false); });
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setPosting(true);
    const res = await fetch('/api/newsfeed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage }),
    });
    if (res.ok) {
      const d = await res.json();
      setPosts([d.data, ...posts]);
      setNewMessage('');
    }
    setPosting(false);
  };

  const handleLike = async (postId: string) => {
    const res = await fetch('/api/newsfeed', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', postId }),
    });
    if (res.ok) {
      setPosts(posts.map(p =>
        p._id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ));
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    setSubmittingComment(postId);
    const res = await fetch('/api/newsfeed', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'comment', postId, content }),
    });
    if (res.ok) {
      const d = await res.json();
      setPosts(posts.map(p =>
        p._id === postId
          ? { ...p, comments: [...(p.comments || []), d.comment] }
          : p
      ));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
    setSubmittingComment(null);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
  ];

  const getAvatarColor = (name: string) => {
    const idx = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Team Newsfeed</h1>
          <p className="page-subtitle">Share updates with your team</p>
        </div>
      </div>

      {/* Share Update Form */}
      <div className="card card-body mb-6">
        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            className="form-input resize-none h-24"
            placeholder="Share an update with your team..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={posting || !newMessage.trim()}
            >
              <Send className="w-4 h-4" />
              {posting ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Rss}
          title="No Updates Yet"
          description="Be the first to share an update with your team."
        />
      ) : (
        <div className="space-y-4">
          {posts.map(post => {
            const commentsOpen = expandedComments.has(post._id);
            const commentCount = post.comments?.length || 0;
            return (
              <div key={post._id} className="card card-body">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(post.staffname || 'U')}`}>
                    {getInitials(post.staffname || 'Unknown User')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{post.staffname || 'Unknown'}</span>
                      {post.pinned === 1 && (
                        <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1 text-xs">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{formatDate(post.dateadded)}</p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 text-sm whitespace-pre-wrap mb-4">{post.message}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      post.liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{commentCount}</span>
                    {commentsOpen
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>

                {/* Comments Section */}
                {commentsOpen && (
                  <div className="mt-4 space-y-3">
                    {commentCount === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
                    )}
                    {(post.comments || []).map(comment => (
                      <div key={comment._id} className="flex items-start gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(comment.staffname || 'U')}`}>
                          {getInitials(comment.staffname || 'U')}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-gray-800">{comment.staffname}</span>
                            <span className="text-xs text-gray-400">{formatDate(comment.dateadded)}</span>
                          </div>
                          <p className="text-xs text-gray-600">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    {/* Comment Input */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        className="form-input text-sm flex-1"
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={e => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        disabled={submittingComment === post._id || !commentInputs[post._id]?.trim()}
                        className="btn-primary py-2 px-3"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
