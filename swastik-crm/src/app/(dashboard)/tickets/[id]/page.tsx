'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Send, Edit, Trash2, User, Clock, Tag,
  Building, MessageSquare, CheckCircle, AlertCircle, Info, Loader2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Reply {
  _id?: string;
  admin?: { firstname?: string; lastname?: string; email?: string } | null;
  userid?: { company?: string } | null;
  message: string;
  date: string;
  name?: string;
  email?: string;
}

interface Ticket {
  _id: string;
  ticketkey: string;
  subject: string;
  message: string;
  date: string;
  lastreply?: string;
  userid?: { _id: string; company: string; phonenumber?: string };
  contactid?: { firstname: string; lastname: string; email: string } | null;
  status?: { _id: string; name: string; color: string };
  priority?: { _id: string; name: string };
  assigned?: { _id: string; firstname: string; lastname: string; email: string } | null;
  department?: { _id: string; name: string } | null;
  project?: { _id: string; name: string } | null;
  cc?: string;
  tags?: string[];
  replies?: Reply[];
  adminread?: number;
  clientread?: number;
}

const priorityColors: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [statuses, setStatuses] = useState<{ _id: string; name: string; color: string }[]>([]);
  const [staffList, setStaffList] = useState<{ _id: string; firstname: string; lastname: string }[]>([]);
  const [updating, setUpdating] = useState(false);
  const repliesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicket = () => {
    fetch(`/api/tickets/${id}`)
      .then(r => r.json())
      .then(data => setTicket(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTicket();
    fetch('/api/tickets/statuses').then(r => r.json()).then(d => setStatuses(d.data || []));
    fetch('/api/staff').then(r => r.json()).then(d => setStaffList(d.data || []));
  }, [id]);

  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.replies?.length]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/tickets/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply }),
    });
    if (res.ok) {
      setReply('');
      fetchTicket();
    }
    setSending(false);
  };

  const handleStatusChange = async (statusId: string) => {
    setUpdating(true);
    await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusId }),
    });
    fetchTicket();
    setUpdating(false);
  };

  const handleAssign = async (staffId: string) => {
    setUpdating(true);
    await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned: staffId || null }),
    });
    fetchTicket();
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="card h-48 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Ticket not found.</p>
        <Link href="/tickets" className="btn-primary mt-4 inline-flex">Back to Tickets</Link>
      </div>
    );
  }

  const priorityName = ticket.priority?.name || 'Medium';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Link href="/tickets" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {ticket.ticketkey}
            </span>
            {ticket.status && (
              <span
                className="badge text-sm px-3 py-1 font-medium"
                style={{ backgroundColor: ticket.status.color + '25', color: ticket.status.color }}
              >
                {ticket.status.name}
              </span>
            )}
            {ticket.priority && (
              <span className={`badge ${priorityColors[priorityName] || 'bg-gray-100 text-gray-700'}`}>
                {priorityName}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-2">{ticket.subject}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              {ticket.userid?.company || 'Unknown Client'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(ticket.date)}
            </span>
            {ticket.replies && ticket.replies.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {ticket.replies.length} repl{ticket.replies.length === 1 ? 'y' : 'ies'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Thread */}
        <div className="lg:col-span-3 space-y-4">
          {/* Original Message */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-semibold text-sm">
                  {ticket.userid?.company?.[0] || 'C'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.userid?.company || 'Client'}</p>
                      <p className="text-xs text-gray-400">{formatDate(ticket.date)}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Original</span>
                  </div>
                  <div
                    className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: ticket.message?.replace(/\n/g, '<br/>') || '' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="space-y-3">
              {ticket.replies.map((rep, idx) => {
                const isAdmin = !!rep.admin;
                return (
                  <div
                    key={rep._id || idx}
                    className={`card ${isAdmin ? 'border-blue-100 bg-blue-50/30' : ''}`}
                  >
                    <div className="card-body">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${
                            isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isAdmin ? 'A' : 'C'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {isAdmin
                                  ? (rep.admin as { firstname?: string; lastname?: string })?.firstname
                                    ? `${(rep.admin as { firstname?: string; lastname?: string }).firstname} ${(rep.admin as { firstname?: string; lastname?: string }).lastname}`
                                    : (rep.name || 'Staff')
                                  : (rep.userid as { company?: string })?.company || rep.name || 'Client'}
                              </p>
                              <p className="text-xs text-gray-400">{formatDate(rep.date)}</p>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                            >
                              {isAdmin ? 'Staff' : 'Client'}
                            </span>
                          </div>
                          <div
                            className="text-gray-700 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: rep.message?.replace(/\n/g, '<br/>') || '' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div ref={repliesEndRef} />

          {/* Reply Box */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Add Reply
              </h3>
            </div>
            <div className="card-body space-y-3">
              <textarea
                className="form-input min-h-[120px] resize-y"
                placeholder="Type your reply here..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSendReply();
                }}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Ctrl+Enter to send</p>
                <button
                  onClick={handleSendReply}
                  disabled={sending || !reply.trim()}
                  className="btn-primary"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Ticket Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-sm">Ticket Details</h3>
            </div>
            <div className="card-body space-y-4">
              {/* Status */}
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={ticket.status?._id || ''}
                  onChange={e => handleStatusChange(e.target.value)}
                  disabled={updating}
                >
                  {statuses.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Assigned */}
              <div>
                <label className="form-label">Assigned To</label>
                <select
                  className="form-select"
                  value={ticket.assigned?._id || ''}
                  onChange={e => handleAssign(e.target.value)}
                  disabled={updating}
                >
                  <option value="">Unassigned</option>
                  {staffList.map(s => (
                    <option key={s._id} value={s._id}>{s.firstname} {s.lastname}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Priority</p>
                <span className={`badge ${priorityColors[priorityName] || 'bg-gray-100 text-gray-700'}`}>
                  {priorityName}
                </span>
              </div>

              {/* Department */}
              {ticket.department && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-medium">{ticket.department.name}</p>
                </div>
              )}

              {/* Project */}
              {ticket.project && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Project</p>
                  <Link href={`/projects/${ticket.project._id}`} className="text-sm text-blue-600 hover:underline">
                    {ticket.project.name}
                  </Link>
                </div>
              )}

              {/* CC */}
              {ticket.cc && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">CC</p>
                  <p className="text-sm font-medium">{ticket.cc}</p>
                </div>
              )}

              {/* Tags */}
              {ticket.tags && ticket.tags.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map(tag => (
                      <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Info */}
          {ticket.userid && (
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-sm">Client</h3>
              </div>
              <div className="card-body space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-semibold text-sm">
                    {ticket.userid.company?.[0]}
                  </div>
                  <div>
                    <Link href={`/clients/${ticket.userid._id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      {ticket.userid.company}
                    </Link>
                    {ticket.userid.phonenumber && (
                      <p className="text-xs text-gray-400">{ticket.userid.phonenumber}</p>
                    )}
                  </div>
                </div>
                {ticket.contactid && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-1">Contact</p>
                    <p className="text-sm font-medium">{ticket.contactid.firstname} {ticket.contactid.lastname}</p>
                    <p className="text-xs text-gray-400">{ticket.contactid.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-sm">Quick Actions</h3>
            </div>
            <div className="card-body space-y-2">
              <button
                onClick={() => handleStatusChange(statuses.find(s => s.name === 'Closed')?._id || '')}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-green-700 hover:bg-green-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Mark as Resolved
              </button>
              <button className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Info className="w-4 h-4" /> View Client Profile
              </button>
              <Link
                href="/tickets"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Tickets
              </Link>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-sm">Timeline</h3>
            </div>
            <div className="card-body space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-700">Ticket opened</p>
                  <p className="text-xs text-gray-400">{formatDate(ticket.date)}</p>
                </div>
              </div>
              {ticket.replies?.map((rep, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${rep.admin ? 'bg-green-500' : 'bg-orange-400'}`} />
                  <div>
                    <p className="text-xs text-gray-700">
                      {rep.admin ? 'Staff replied' : 'Client replied'}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(rep.date)}</p>
                  </div>
                </div>
              ))}
              {ticket.lastreply && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Last activity: {formatDate(ticket.lastreply)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
