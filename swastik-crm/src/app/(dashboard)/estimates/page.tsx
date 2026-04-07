'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye, Send, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Estimate {
  _id: string;
  prefix: string;
  number: number;
  client?: { _id: string; company: string };
  total: number;
  date: string;
  expirydate: string;
  status: number; // 0=draft, 1=sent, 2=declined, 3=accepted, 4=expired
}

const STATUS_LABELS = ['Draft', 'Sent', 'Declined', 'Accepted', 'Expired'];

const STATUS_COLORS: Record<number, string> = {
  0: 'bg-gray-100 text-gray-700',
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-red-100 text-red-800',
  3: 'bg-green-100 text-green-800',
  4: 'bg-orange-100 text-orange-800',
};

const STATUS_ICONS = [
  <Clock key="draft" className="w-5 h-5 text-gray-500" />,
  <Send key="sent" className="w-5 h-5 text-blue-500" />,
  <XCircle key="declined" className="w-5 h-5 text-red-500" />,
  <CheckCircle key="accepted" className="w-5 h-5 text-green-500" />,
  <AlertCircle key="expired" className="w-5 h-5 text-orange-500" />,
];

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Estimate | null>(null);
  const [sendTarget, setSendTarget] = useState<Estimate | null>(null);
  const [sending, setSending] = useState(false);

  const fetchEstimates = () => {
    setLoading(true);
    fetch('/api/estimates')
      .then(r => r.json())
      .then(data => setEstimates(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEstimates(); }, []);

  const filtered = estimates.filter(e => {
    const matchSearch =
      e.client?.company?.toLowerCase().includes(search.toLowerCase()) ||
      `${e.prefix}-${String(e.number).padStart(5, '0')}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === parseInt(statusFilter);
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/estimates/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchEstimates();
  };

  const handleSend = async () => {
    if (!sendTarget) return;
    setSending(true);
    await fetch(`/api/estimates/${sendTarget._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 1 }),
    });
    setSending(false);
    setSendTarget(null);
    fetchEstimates();
  };

  const formatEstimateNumber = (est: Estimate) =>
    `${est.prefix}-${String(est.number).padStart(5, '0')}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Estimates</h1>
          <p className="page-subtitle">Create and manage client estimates</p>
        </div>
        <Link href="/estimates/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Estimate
        </Link>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {STATUS_LABELS.map((label, i) => {
          const count = estimates.filter(e => e.status === i).length;
          return (
            <button
              key={label}
              onClick={() => setStatusFilter(statusFilter === String(i) ? 'all' : String(i))}
              className={`card p-4 text-left hover:shadow-md transition-all ${statusFilter === String(i) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                {STATUS_ICONS[i]}
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="form-input pl-10"
                placeholder="Search by estimate # or client..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="form-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                {STATUS_LABELS.map((label, i) => (
                  <option key={i} value={String(i)}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">
            {filtered.length} Estimate{filtered.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm text-gray-500">
            Total: {formatCurrency(filtered.reduce((s, e) => s + (e.total || 0), 0))}
          </span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">No estimates found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Estimate #</th>
                    <th>Client</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(est => (
                    <tr key={est._id}>
                      <td>
                        <Link href={`/estimates/${est._id}`} className="font-medium text-blue-600 hover:underline">
                          {formatEstimateNumber(est)}
                        </Link>
                      </td>
                      <td>
                        {est.client ? (
                          <Link href={`/clients/${est.client._id}`} className="text-gray-700 hover:text-blue-600">
                            {est.client.company}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="font-medium">{formatCurrency(est.total)}</td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[est.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[est.status] ?? 'Unknown'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap">{formatDate(est.date)}</td>
                      <td className="whitespace-nowrap">{formatDate(est.expirydate)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/estimates/${est._id}`}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {est.status === 0 && (
                            <button
                              onClick={() => setSendTarget(est)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Send Estimate"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            href={`/estimates/${est._id}/edit`}
                            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(est)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Send Estimate Confirmation */}
      {sendTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Send Estimate</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Send estimate <strong>{formatEstimateNumber(sendTarget)}</strong> to{' '}
              <strong>{sendTarget.client?.company || 'client'}</strong>?
              The status will be updated to <em>Sent</em>.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSendTarget(null)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Estimate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Estimate</h2>
            <p className="text-gray-600 mb-6">
              Delete estimate <strong>{formatEstimateNumber(deleteTarget)}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
