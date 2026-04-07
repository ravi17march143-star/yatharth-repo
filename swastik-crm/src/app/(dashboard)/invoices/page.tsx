'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface Invoice {
  _id: string;
  prefix: string;
  number: number;
  client: { _id: string; company: string };
  total: number;
  date: string;
  due_date: string;
  status: number; // 0=draft,1=unpaid,2=paid,3=overdue,4=cancelled
}

const STATUS_LABELS = ['Draft', 'Unpaid', 'Paid', 'Overdue', 'Cancelled'];
const STATUS_KEYS = ['draft', 'unpaid', 'paid', 'overdue', 'cancelled'];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  const fetchInvoices = () => {
    setLoading(true);
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => setInvoices(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, []);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client?.company?.toLowerCase().includes(search.toLowerCase()) ||
      `${inv.prefix}-${String(inv.number).padStart(5, '0')}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === parseInt(statusFilter);
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/invoices/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchInvoices();
  };

  const statusCounts = STATUS_LABELS.map((_, i) => invoices.filter(inv => inv.status === i).length);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all your invoices</p>
        </div>
        <Link href="/invoices/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {STATUS_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStatusFilter(statusFilter === String(i) ? 'all' : String(i))}
            className={`card p-4 text-left transition-all hover:shadow-md ${statusFilter === String(i) ? 'ring-2 ring-blue-500' : ''}`}
          >
            <p className="text-2xl font-bold text-gray-800">{statusCounts[i]}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="form-input pl-10"
                placeholder="Search by invoice # or client..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
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
          <span className="font-semibold text-gray-700">{filtered.length} Invoice{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-400">No invoices found</td></tr>
                  ) : filtered.map(inv => (
                    <tr key={inv._id}>
                      <td>
                        <Link href={`/invoices/${inv._id}`} className="font-medium text-blue-600 hover:underline">
                          {inv.prefix}-{String(inv.number).padStart(5, '0')}
                        </Link>
                      </td>
                      <td>
                        {inv.client ? (
                          <Link href={`/clients/${inv.client._id}`} className="text-gray-700 hover:text-blue-600">
                            {inv.client.company}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="font-medium">{formatCurrency(inv.total)}</td>
                      <td>{formatDate(inv.date)}</td>
                      <td className={inv.status === 3 ? 'text-red-600 font-medium' : ''}>{formatDate(inv.due_date)}</td>
                      <td>
                        <span className={`badge ${getStatusColor(STATUS_KEYS[inv.status] || 'draft')}`}>
                          {STATUS_LABELS[inv.status]}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/invoices/${inv._id}`} className="p-1 text-gray-400 hover:text-blue-600" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/invoices/${inv._id}/edit`} className="p-1 text-gray-400 hover:text-yellow-600" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteTarget(inv)} className="p-1 text-gray-400 hover:text-red-600" title="Delete">
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

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Invoice</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete invoice <strong>{deleteTarget.prefix}-{String(deleteTarget.number).padStart(5, '0')}</strong>?
            </p>
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
