'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Edit, Trash2, X, Loader2, Eye, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Client { _id: string; company: string; }
interface CreditNote {
  _id: string;
  prefix?: string;
  number: number;
  client: Client;
  total: number;
  remaining?: number;
  date: string;
  status: number;
  reference_no?: string;
  note?: string;
  currency?: string;
  discount?: number;
}

interface CreditNoteItem {
  description: string;
  amount: string;
}

const STATUS_MAP: Record<number, { label: string; cls: string }> = {
  1: { label: 'Open', cls: 'bg-blue-100 text-blue-700' },
  2: { label: 'Closed', cls: 'bg-gray-100 text-gray-600' },
  3: { label: 'Void', cls: 'bg-red-100 text-red-700' },
};

const EMPTY_FORM = {
  client: '', date: '', note: '', currency: 'USD', discount: '',
};

const EMPTY_ITEM: CreditNoteItem = { description: '', amount: '' };

export default function CreditNotesPage() {
  const [notes, setNotes] = useState<CreditNote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<CreditNote | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [items, setItems] = useState<CreditNoteItem[]>([{ ...EMPTY_ITEM }]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CreditNote | null>(null);

  const fetchNotes = () => {
    setLoading(true);
    fetch('/api/credit-notes')
      .then(r => r.json())
      .then(d => setNotes(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotes();
    fetch('/api/clients?limit=200').then(r => r.json()).then(d => setClients(d.data || [])).catch(() => {});
  }, []);

  const filtered = notes.filter(n => {
    const noteNum = `${n.prefix || 'CN'}-${String(n.number).padStart(5, '0')}`;
    const matchSearch = noteNum.toLowerCase().includes(search.toLowerCase()) ||
      (n.client?.company || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || String(n.status) === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalCount = notes.length;
  const openCount = notes.filter(n => n.status === 1).length;
  const closedCount = notes.filter(n => n.status === 2).length;
  const totalAmount = notes.reduce((sum, n) => sum + (n.total || 0), 0);

  const openAdd = () => {
    setEditingNote(null);
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
    setItems([{ ...EMPTY_ITEM }]);
    setShowModal(true);
  };

  const openEdit = (n: CreditNote) => {
    setEditingNote(n);
    setForm({
      client: n.client?._id || '',
      date: n.date ? n.date.split('T')[0] : '',
      note: n.note || '',
      currency: n.currency || 'USD',
      discount: n.discount ? String(n.discount) : '',
    });
    setItems([{ description: '', amount: String(n.total || '') }]);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.client || !form.date) return;
    setSaving(true);
    const url = editingNote ? `/api/credit-notes/${editingNote._id}` : '/api/credit-notes';
    const method = editingNote ? 'PUT' : 'POST';
    const payload = {
      ...form,
      discount: form.discount ? parseFloat(form.discount) : 0,
      items: items.map(i => ({
        description: i.description,
        amount: parseFloat(i.amount) || 0,
      })),
    };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowModal(false);
      fetchNotes();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/credit-notes/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchNotes();
  };

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof CreditNoteItem, value: string) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const totalCalc = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Credit Notes</h1>
          <p className="page-subtitle">{totalCount} credit note{totalCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> New Credit Note
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{openCount}</p>
            <p className="text-xs text-gray-500">Open</p>
          </div>
        </div>
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{closedCount}</p>
            <p className="text-xs text-gray-500">Closed</p>
          </div>
        </div>
        <div className="card card-body flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            <p className="text-xs text-gray-500">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search credit notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select w-40"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="1">Open</option>
          <option value="2">Closed</option>
          <option value="3">Void</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No credit notes found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first credit note</p>
            <button onClick={openAdd} className="btn-primary mt-4 mx-auto">
              <Plus className="w-4 h-4" /> New Credit Note
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Credit Note #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(n => {
                  const s = STATUS_MAP[n.status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-600' };
                  const noteNum = `${n.prefix || 'CN'}-${String(n.number).padStart(5, '0')}`;
                  return (
                    <tr key={n._id}>
                      <td>
                        <Link
                          href={`/credit-notes/${n._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {noteNum}
                        </Link>
                      </td>
                      <td className="text-gray-600">{n.client?.company || '—'}</td>
                      <td className="font-semibold text-gray-900">{formatCurrency(n.total)}</td>
                      <td className="text-gray-500 text-sm">
                        {n.remaining !== undefined ? formatCurrency(n.remaining) : '—'}
                      </td>
                      <td>
                        <span className={`badge ${s.cls}`}>{s.label}</span>
                      </td>
                      <td className="text-gray-500 text-sm">{formatDate(n.date)}</td>
                      <td>
                        <div className="flex gap-1">
                          <Link
                            href={`/credit-notes/${n._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(n)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(n)}
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
              <h2 className="text-lg font-semibold">{editingNote ? 'Edit Credit Note' : 'New Credit Note'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
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
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label mb-0">Items</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input
                        className="form-input flex-1"
                        placeholder="Item description"
                        value={item.description}
                        onChange={e => updateItem(i, 'description', e.target.value)}
                      />
                      <input
                        type="number"
                        className="form-input w-28"
                        placeholder="Amount"
                        step="0.01"
                        value={item.amount}
                        onChange={e => updateItem(i, 'amount', e.target.value)}
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded mt-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Total: {formatCurrency(totalCalc)}
                  </span>
                </div>
              </div>

              <div>
                <label className="form-label">Note</label>
                <textarea
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Additional notes..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.client || !form.date} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving...' : editingNote ? 'Update' : 'Create Credit Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Credit Note</h2>
            <p className="text-gray-600 mb-6">
              Delete credit note <strong>CN-{String(deleteTarget.number).padStart(5, '0')}</strong>? This cannot be undone.
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
