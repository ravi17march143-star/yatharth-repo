'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Ticket, ArrowLeft, Plus, Send, X, LogOut } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PortalClient { _id: string; company: string; }
interface TicketItem { _id: string; ticketkey: string; subject: string; status: { name: string; color: string }; priority: { name: string }; date: string; replies: unknown[]; }

export default function PortalTicketsPage() {
  const router = useRouter();
  const [client, setClient] = useState<PortalClient | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '', priority: '' });
  const [priorities, setPriorities] = useState<{ _id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async (c: PortalClient) => {
    const res = await fetch(`/api/portal/tickets?clientId=${c._id}`);
    const data = await res.json();
    setTickets(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('portal_client');
    if (!stored) { router.push('/portal/login'); return; }
    const c = JSON.parse(stored) as PortalClient;
    setClient(c);
    fetchTickets(c);
    fetch('/api/tickets/priorities').then(r => r.json()).then(d => setPriorities(d.data || []));
  }, [router, fetchTickets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !form.subject || !form.message) return;
    setSubmitting(true);
    await fetch('/api/portal/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, clientId: client._id }),
    });
    setShowNew(false);
    setForm({ subject: '', message: '', priority: '' });
    fetchTickets(client);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Swastik CRM <span className="text-gray-400 font-normal">| Client Portal</span></span>
          </div>
          <button onClick={() => { sessionStorage.removeItem('portal_client'); router.push('/portal/login'); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/portal/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-sm text-gray-500">{client?.company}</p>
            </div>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No support tickets yet</p>
              <button onClick={() => setShowNew(true)} className="btn-primary mx-auto">
                <Plus className="w-4 h-4" /> Open Ticket
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Replies</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map(t => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.ticketkey}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{t.subject}</td>
                    <td className="px-6 py-4">
                      <span className="badge bg-gray-100 text-gray-700">{t.priority?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.status && (
                        <span className="badge" style={{ backgroundColor: t.status.color + '20', color: t.status.color }}>
                          {t.status.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{t.replies?.length || 0}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* New Ticket Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">New Support Ticket</h2>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Subject *</label>
                <input className="form-input" placeholder="Brief description of the issue" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
              </div>
              <div>
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="">Select Priority</option>
                  {priorities.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Message *</label>
                <textarea className="form-input min-h-[120px]" placeholder="Describe your issue in detail..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
