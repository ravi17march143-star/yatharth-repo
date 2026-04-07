'use client';

import { useState, useEffect } from 'react';
import { Plus, Megaphone, Trash2, Edit, X, Loader2, List, LayoutGrid, Users, Building2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Announcement {
  _id: string;
  name: string;
  message: string;
  showtousers: number;
  showtostaff: number;
  date_from?: string;
  date_to?: string;
  dateadded: string;
}

const EMPTY_FORM = {
  name: '', message: '',
  showtostaff: true, showtousers: true,
  date_from: '', date_to: '',
};

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => setItems(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingItem(a);
    setForm({
      name: a.name,
      message: a.message,
      showtostaff: Boolean(a.showtostaff),
      showtousers: Boolean(a.showtousers),
      date_from: a.date_from ? a.date_from.split('T')[0] : '',
      date_to: a.date_to ? a.date_to.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.message.trim()) return;
    setSaving(true);
    const url = editingItem ? `/api/announcements/${editingItem._id}` : '/api/announcements';
    const method = editingItem ? 'PUT' : 'POST';
    const payload = {
      name: form.name,
      message: form.message,
      showtostaff: form.showtostaff ? 1 : 0,
      showtousers: form.showtousers ? 1 : 0,
      date_from: form.date_from || null,
      date_to: form.date_to || null,
    };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowModal(false);
      fetchAnnouncements();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/announcements/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchAnnouncements();
  };

  const visibleItems = items.filter(a => !dismissed.has(a._id));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Broadcast messages to staff and clients</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('cards')}
              className={`p-1.5 rounded-md transition-all ${view === 'cards' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded-md transition-all ${view === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card card-body animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No announcements yet</p>
          <p className="text-sm text-gray-400 mt-1">Create an announcement to broadcast to your team and clients</p>
          <button onClick={openAdd} className="btn-primary mt-5 mx-auto">
            <Plus className="w-4 h-4" /> Add Announcement
          </button>
        </div>
      ) : view === 'cards' ? (
        /* CARD VIEW */
        <div className="space-y-4">
          {visibleItems.map(a => (
            <div key={a._id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Megaphone className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{a.name}</h3>
                      <div className="flex gap-1.5">
                        {a.showtostaff === 1 && (
                          <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Staff
                          </span>
                        )}
                        {a.showtousers === 1 && (
                          <span className="badge bg-purple-100 text-purple-700 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> Clients
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{a.message}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(a.dateadded)}
                      </span>
                      {a.date_from && (
                        <span className="text-gray-400 text-xs">
                          Active: {formatDate(a.date_from)}{a.date_to ? ` – ${formatDate(a.date_to)}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(a)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(a)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDismissed(d => new Set([...d, a._id]))}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded ml-1"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {dismissed.size > 0 && visibleItems.length < items.length && (
            <p className="text-sm text-gray-400 text-center">
              {dismissed.size} announcement{dismissed.size !== 1 ? 's' : ''} dismissed.{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setDismissed(new Set())}
              >
                Show all
              </button>
            </p>
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card">
          <div className="card-header">
            <span className="font-semibold text-gray-700">{items.length} announcement{items.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Show To</th>
                  <th>Date Range</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(a => (
                  <tr key={a._id}>
                    <td>
                      <p className="font-medium text-gray-900">{a.name}</p>
                    </td>
                    <td>
                      <p className="text-gray-500 text-sm truncate max-w-xs">{a.message}</p>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        {a.showtostaff === 1 && (
                          <span className="badge bg-blue-100 text-blue-700">Staff</span>
                        )}
                        {a.showtousers === 1 && (
                          <span className="badge bg-purple-100 text-purple-700">Clients</span>
                        )}
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {a.date_from ? (
                        <span>{formatDate(a.date_from)}{a.date_to ? ` – ${formatDate(a.date_to)}` : ''}</span>
                      ) : '—'}
                    </td>
                    <td className="text-gray-400 text-xs">{formatDate(a.dateadded)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">{editingItem ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="Announcement title"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input resize-none"
                  rows={5}
                  placeholder="Announcement message..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Show To</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showtostaff}
                      onChange={e => setForm(f => ({ ...f, showtostaff: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700">Staff</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showtousers}
                      onChange={e => setForm(f => ({ ...f, showtousers: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700">Clients</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">Date Range (optional)</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">From</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.date_from}
                      onChange={e => setForm(f => ({ ...f, date_from: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">To</label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.date_to}
                      onChange={e => setForm(f => ({ ...f, date_to: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.message.trim()}
                className="btn-primary"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Publishing...' : editingItem ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Announcement</h2>
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
