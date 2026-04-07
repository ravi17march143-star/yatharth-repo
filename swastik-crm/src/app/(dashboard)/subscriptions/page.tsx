'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCcw, Edit, Trash2, X, Loader2, DollarSign, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Client { _id: string; company: string; }
interface Tax { _id: string; name: string; taxrate: number; }
interface Subscription {
  _id: string;
  name: string;
  description?: string;
  client: Client;
  amount: number;
  currency?: string;
  tax?: Tax | null;
  status: string;
  next_billing_cycle?: string;
  date?: string;
  quantity: number;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  Active: { label: 'Active', cls: 'bg-green-100 text-green-700', icon: CheckCircle },
  Suspended: { label: 'Suspended', cls: 'bg-yellow-100 text-yellow-700', icon: PauseCircle },
  Cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700', icon: XCircle },
};

const EMPTY_FORM = {
  name: '', description: '', client: '', amount: '', currency: 'USD',
  tax: '', status: 'Active', next_billing_cycle: '', quantity: '1',
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);

  const fetchSubscriptions = () => {
    setLoading(true);
    fetch('/api/subscriptions')
      .then(r => r.json())
      .then(d => setSubscriptions(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscriptions();
    fetch('/api/clients?limit=200').then(r => r.json()).then(d => setClients(d.data || [])).catch(() => {});
    fetch('/api/taxes').then(r => r.json()).then(d => setTaxes(d.data || [])).catch(() => {});
  }, []);

  const filtered = subscriptions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.client?.company || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const total = subscriptions.length;
  const active = subscriptions.filter(s => s.status === 'Active').length;
  const cancelled = subscriptions.filter(s => s.status === 'Cancelled').length;
  const totalRevenue = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.amount * (s.quantity || 1)), 0);

  const openAdd = () => {
    setEditingSub(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (s: Subscription) => {
    setEditingSub(s);
    setForm({
      name: s.name,
      description: s.description || '',
      client: s.client?._id || '',
      amount: String(s.amount || ''),
      currency: s.currency || 'USD',
      tax: (s.tax as Tax | null)?._id || '',
      status: s.status || 'Active',
      next_billing_cycle: s.next_billing_cycle ? s.next_billing_cycle.split('T')[0] : '',
      quantity: String(s.quantity || 1),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.client) return;
    setSaving(true);
    const url = editingSub ? `/api/subscriptions/${editingSub._id}` : '/api/subscriptions';
    const method = editingSub ? 'PUT' : 'POST';
    const payload = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      quantity: parseInt(form.quantity) || 1,
    };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowModal(false);
      fetchSubscriptions();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/subscriptions/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchSubscriptions();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Manage recurring client subscriptions</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> New Subscription
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <RefreshCcw className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{active}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{cancelled}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
        </div>
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-gray-500">Active Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search subscriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select w-44"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{filtered.length} subscription{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <RefreshCcw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No subscriptions found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first subscription to get started</p>
            <button onClick={openAdd} className="btn-primary mt-4 mx-auto">
              <Plus className="w-4 h-4" /> New Subscription
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Next Billing</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG['Active'];
                  return (
                    <tr key={s._id}>
                      <td>
                        <p className="font-medium text-gray-900">{s.name}</p>
                        {s.description && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{s.description}</p>
                        )}
                      </td>
                      <td className="text-gray-600">{s.client?.company || '—'}</td>
                      <td className="font-semibold text-gray-900">
                        {formatCurrency(s.amount)}
                        {s.quantity > 1 && (
                          <span className="text-xs text-gray-400 ml-1">x{s.quantity}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                      </td>
                      <td className="text-gray-500 text-sm">
                        {s.next_billing_cycle ? formatDate(s.next_billing_cycle) : '—'}
                      </td>
                      <td className="text-gray-500 text-sm">
                        {s.date ? formatDate(s.date) : '—'}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">{editingSub ? 'Edit Subscription' : 'New Subscription'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  placeholder="Subscription name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input resize-none"
                  rows={2}
                  placeholder="Optional description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Client *</label>
                <select
                  className="form-select"
                  value={form.client}
                  onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                >
                  <option value="">Select client</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>{c.company}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Currency</label>
                  <input
                    className="form-input"
                    placeholder="USD"
                    value={form.currency}
                    onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Tax</label>
                  <select
                    className="form-select"
                    value={form.tax}
                    onChange={e => setForm(f => ({ ...f, tax: e.target.value }))}
                  >
                    <option value="">No Tax</option>
                    {taxes.map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.taxrate}%)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Next Billing Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.next_billing_cycle}
                    onChange={e => setForm(f => ({ ...f, next_billing_cycle: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.client} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving...' : editingSub ? 'Update' : 'Create Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Subscription</h2>
            <p className="text-gray-600 mb-6">
              Delete <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? This cannot be undone.
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
