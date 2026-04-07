'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

interface Proposal {
  _id: string;
  subject: string;
  to: string;
  proposal_to: string; // 'lead' | 'customer'
  total: number;
  date: string;
  open_till: string;
  status: number; // 0=draft,1=sent,2=open,3=revised,4=declined,5=accepted
  pipeline_order?: number;
}

const STATUS_LABELS = ['Draft', 'Sent', 'Open', 'Revised', 'Declined', 'Accepted'];
const STATUS_KEYS = ['draft', 'sent', 'open', 'pending', 'cancelled', 'active'];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Proposal | null>(null);

  const fetchProposals = () => {
    setLoading(true);
    fetch('/api/proposals')
      .then(r => r.json())
      .then(data => setProposals(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProposals(); }, []);

  const filtered = proposals.filter(p => {
    const matchSearch = p.subject?.toLowerCase().includes(search.toLowerCase()) || p.to?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === parseInt(statusFilter);
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/proposals/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchProposals();
  };

  const statusBadgeColors: Record<number, string> = {
    0: 'bg-gray-100 text-gray-700',
    1: 'bg-blue-100 text-blue-700',
    2: 'bg-cyan-100 text-cyan-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-red-100 text-red-700',
    5: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage sales proposals</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Proposal
        </button>
      </div>

      {/* Status tiles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${statusFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          All ({proposals.length})
        </button>
        {STATUS_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setStatusFilter(statusFilter === String(i) ? 'all' : String(i))}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${statusFilter === String(i) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {label} ({proposals.filter(p => p.status === i).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="form-input pl-10" placeholder="Search proposals..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{filtered.length} Proposal{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Open Till</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-400">No proposals found</td></tr>
                  ) : filtered.map(prop => (
                    <tr key={prop._id}>
                      <td>
                        <Link href={`/proposals/${prop._id}`} className="font-medium text-blue-600 hover:underline">{prop.subject}</Link>
                      </td>
                      <td className="text-gray-600">{prop.to || '—'}</td>
                      <td>
                        <span className="badge bg-gray-100 text-gray-700 capitalize">{prop.proposal_to}</span>
                      </td>
                      <td>{formatDate(prop.date)}</td>
                      <td>{formatDate(prop.open_till)}</td>
                      <td>
                        <span className={`badge ${statusBadgeColors[prop.status] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[prop.status]}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/proposals/${prop._id}`} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></Link>
                          <button className="p-1 text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteTarget(prop)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Proposal</h2>
            <p className="text-gray-600 mb-6">Delete proposal <strong>{deleteTarget.subject}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
