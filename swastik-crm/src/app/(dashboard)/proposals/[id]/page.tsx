'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit, Send, Download, Printer, FileText,
  MessageSquare, Trash2, CheckSquare, Save, X
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface ProposalItem {
  description: string;
  qty: number;
  rate: number;
  tax: number;
  amount: number;
}

interface Comment {
  _id: string;
  content: string;
  addedfrom?: { name: string };
  dateadded: string;
}

interface Proposal {
  _id: string;
  subject: string;
  to: string;
  proposal_to: string;
  rel_id?: string;
  rel_type?: string;
  email: string;
  date: string;
  open_till: string;
  status: number; // 0=Draft,1=Sent,2=Open,3=Revised,4=Declined,5=Accepted
  content: string;
  items: ProposalItem[];
  subtotal: number;
  discount: number;
  discount_type: string;
  tax: number;
  total: number;
  note: string;
  currency?: string;
}

const STATUS_LABELS = ['Draft', 'Sent', 'Open', 'Revised', 'Declined', 'Accepted'];
const STATUS_COLORS: Record<number, string> = {
  0: 'bg-gray-100 text-gray-700',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-cyan-100 text-cyan-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-red-100 text-red-700',
  5: 'bg-green-100 text-green-700',
};

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proposal, setProposal]     = useState<Proposal | null>(null);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState<'overview' | 'comments'>('overview');
  const [comments, setComments]     = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const [convertingInvoice, setConvertingInvoice] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [sendOpen, setSendOpen]     = useState(false);
  const [sending, setSending]       = useState(false);
  const [sendEmail, setSendEmail]   = useState('');

  useEffect(() => {
    fetch(`/api/proposals/${id}`)
      .then(r => r.json())
      .then(d => {
        setProposal(d.data);
        setSendEmail(d.data?.email || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'comments') {
      fetch(`/api/proposals/${id}/comments`)
        .then(r => r.json()).then(d => setComments(d.data || []));
    }
  }, [activeTab, id]);

  const handleConvertToInvoice = async () => {
    if (!confirm('Convert this proposal to an invoice?')) return;
    setConvertingInvoice(true);
    try {
      const res = await fetch(`/api/proposals/${id}/convert`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.data) {
        router.push(`/invoices/${data.data._id}`);
      } else {
        alert(data.error || 'Failed to convert to invoice');
      }
    } finally {
      setConvertingInvoice(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/proposals/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sendEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setProposal(prev => prev ? { ...prev, status: 1 } : prev);
        setSendOpen(false);
      } else {
        alert(data.error || 'Failed to send proposal');
      }
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/proposals/${id}`, { method: 'DELETE' });
      router.push('/proposals');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      const res = await fetch(`/api/proposals/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      if (data.data) setComments(prev => [data.data, ...prev]);
      setCommentText('');
    } finally {
      setAddingComment(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card"><div className="card-body h-64 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Proposal not found.</p>
        <Link href="/proposals" className="btn-primary mt-4 inline-flex items-center gap-2">Back to Proposals</Link>
      </div>
    );
  }

  const statusCls = STATUS_COLORS[proposal.status] ?? STATUS_COLORS[0];
  const statusLabel = STATUS_LABELS[proposal.status] ?? 'Unknown';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Link href="/proposals" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{proposal.subject}</h1>
            <span className={`badge px-3 py-1 text-sm font-medium rounded-full ${statusCls}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            To: {proposal.to} &middot; {formatDate(proposal.date)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setSendOpen(true)} className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" /> Send
          </button>
          <button
            onClick={handleConvertToInvoice}
            disabled={convertingInvoice}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            {convertingInvoice ? 'Converting...' : 'Convert to Invoice'}
          </button>
          <Link href={`/proposals/${id}/edit`} className="btn-secondary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => setDeleteOpen(true)} className="btn-danger flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="card mb-6">
        <div className="card-body py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STATUS_LABELS.map((label, idx) => (
              <div key={idx} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  proposal.status === idx
                    ? STATUS_COLORS[idx]
                    : proposal.status > idx
                    ? 'bg-gray-100 text-gray-500 line-through'
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  {proposal.status > idx && <CheckSquare className="w-3 h-3" />}
                  {label}
                </div>
                {idx < STATUS_LABELS.length - 1 && (
                  <div className={`w-6 h-0.5 ${proposal.status > idx ? 'bg-gray-300' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {(['overview', 'comments'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' && <FileText className="w-4 h-4" />}
            {tab === 'comments' && <MessageSquare className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Content/Body */}
            {proposal.content && (
              <div className="card">
                <div className="card-header"><h3 className="font-semibold">Proposal Content</h3></div>
                <div className="card-body">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: proposal.content }}
                  />
                </div>
              </div>
            )}

            {/* Items Table */}
            {proposal.items?.length > 0 && (
              <div className="card">
                <div className="card-header"><h3 className="font-semibold">Line Items</h3></div>
                <div className="card-body p-0">
                  <table className="data-table w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-600">Description</th>
                        <th className="text-right p-3 font-semibold text-gray-600">Qty</th>
                        <th className="text-right p-3 font-semibold text-gray-600">Rate</th>
                        <th className="text-right p-3 font-semibold text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {proposal.items.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-700">{item.description}</td>
                          <td className="p-3 text-right text-gray-600">{item.qty}</td>
                          <td className="p-3 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                          <td className="p-3 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 flex justify-end border-t">
                    <div className="w-52 space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span><span>{formatCurrency(proposal.subtotal)}</span>
                      </div>
                      {proposal.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount</span><span>-{formatCurrency(proposal.discount)}</span>
                        </div>
                      )}
                      {proposal.tax > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span><span>{formatCurrency(proposal.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-gray-900 pt-2 border-t text-base">
                        <span>Total</span><span>{formatCurrency(proposal.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            {proposal.note && (
              <div className="card">
                <div className="card-header"><h3 className="font-semibold">Notes</h3></div>
                <div className="card-body">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{proposal.note}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Proposal Info</h3></div>
              <div className="card-body space-y-3">
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-sm font-medium">{proposal.to || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{proposal.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Proposal To</p>
                  <p className="text-sm font-medium capitalize">{proposal.proposal_to || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">{formatDate(proposal.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Open Till</p>
                  <p className="text-sm font-medium">{formatDate(proposal.open_till)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`badge px-2 py-0.5 text-xs font-medium rounded-full ${statusCls}`}>
                    {statusLabel}
                  </span>
                </div>
                {proposal.total > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(proposal.total)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="max-w-3xl space-y-4">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Add Comment</label>
              <textarea
                className="form-input resize-none h-24 mb-3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                disabled={addingComment || !commentText.trim()}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {addingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No comments yet</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="card">
                <div className="card-body">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <span>{comment.addedfrom?.name || 'Staff'}</span>
                    <span>&middot;</span>
                    <span>{formatDate(comment.dateadded)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Send Modal */}
      <Modal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
        title="Send Proposal"
        size="md"
        footer={
          <>
            <button onClick={() => setSendOpen(false)} className="btn-secondary flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSend} disabled={sending} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Proposal'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send <strong>{proposal.subject}</strong> to the client via email.
          </p>
          <div>
            <label className="form-label">Recipient Email</label>
            <input
              type="email"
              className="form-input"
              value={sendEmail}
              onChange={e => setSendEmail(e.target.value)}
              placeholder="client@example.com"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Proposal"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{proposal.subject}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
