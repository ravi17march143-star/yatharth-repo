'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, UserPlus, Eye, Edit, Trash2, LayoutGrid, List, X, Loader2, GripVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface LeadStatus { _id: string; name: string; color: string; }
interface LeadSource { _id: string; name: string; }
interface Lead {
  _id: string;
  name: string;
  company: string;
  email: string;
  phonenumber: string;
  status: LeadStatus;
  source: LeadSource | null;
  dateadded: string;
  address?: string;
  country?: string;
  note?: string;
}

const EMPTY_FORM = {
  name: '', company: '', email: '', phonenumber: '',
  status: '', source: '', address: '', country: '', note: '',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const fetchLeads = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    fetch(`/api/leads?${params}`)
      .then(r => r.json())
      .then(d => {
        setLeads(d.data || []);
        setTotal(d.pagination?.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  useEffect(() => {
    fetch('/api/leads/statuses').then(r => r.json()).then(d => setStatuses(d.data || [])).catch(() => {});
    fetch('/api/leads/sources').then(r => r.json()).then(d => setSources(d.data || [])).catch(() => {});
  }, []);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.company || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status?._id === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingLead(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (l: Lead) => {
    setEditingLead(l);
    setForm({
      name: l.name,
      company: l.company || '',
      email: l.email || '',
      phonenumber: l.phonenumber || '',
      status: l.status?._id || '',
      source: l.source?._id || '',
      address: l.address || '',
      country: l.country || '',
      note: l.note || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const url = editingLead ? `/api/leads/${editingLead._id}` : '/api/leads';
    const method = editingLead ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowModal(false);
      fetchLeads();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/leads/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchLeads();
  };

  // Kanban grouping by status
  const kanbanColumns = statuses.map(s => ({
    status: s,
    leads: filtered.filter(l => l.status?._id === s._id),
  }));
  // Leads with no status or unknown status
  const unassigned = filtered.filter(l => !l.status || !statuses.find(s => s._id === l.status?._id));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">{total} total leads</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Kanban view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select w-48"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="card">
          <div className="card-header">
            <span className="font-semibold text-gray-700">{filtered.length} lead{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <UserPlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No leads found</p>
              <p className="text-sm text-gray-400 mt-1">Add your first lead to start tracking sales</p>
              <button onClick={openAdd} className="btn-primary mt-4 mx-auto">
                <Plus className="w-4 h-4" /> Add Lead
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l._id}>
                      <td>
                        <Link href={`/leads/${l._id}`} className="font-medium text-blue-600 hover:underline">
                          {l.name}
                        </Link>
                      </td>
                      <td className="text-gray-600">{l.company || '—'}</td>
                      <td className="text-gray-500 text-sm">{l.email || '—'}</td>
                      <td className="text-gray-500 text-sm">{l.phonenumber || '—'}</td>
                      <td>
                        {l.status ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: l.status.color + '20', color: l.status.color }}
                          >
                            {l.status.name}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="text-gray-500 text-sm">{l.source?.name || '—'}</td>
                      <td className="text-gray-400 text-xs">{formatDate(l.dateadded)}</td>
                      <td>
                        <div className="flex gap-1">
                          <Link
                            href={`/leads/${l._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(l)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(l)}
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
          )}
        </div>
      )}

      {/* KANBAN VIEW */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => (
            <div
              key={col.status._id}
              className="flex-shrink-0 w-64 rounded-xl border-2 border-gray-200 bg-gray-50 p-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="badge text-xs font-semibold"
                    style={{ backgroundColor: col.status.color + '20', color: col.status.color }}
                  >
                    {col.status.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{col.leads.length}</span>
                </div>
                <button
                  onClick={openAdd}
                  className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lead Cards */}
              <div className="space-y-2">
                {col.leads.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs">No leads</div>
                ) : col.leads.map(l => (
                  <div
                    key={l._id}
                    className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Drag indicator */}
                    <div className="flex items-start gap-1.5 mb-2">
                      <GripVertical className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug truncate">{l.name}</p>
                        {l.company && (
                          <p className="text-xs text-gray-400 truncate">{l.company}</p>
                        )}
                      </div>
                    </div>
                    {l.email && (
                      <p className="text-xs text-gray-400 truncate mb-1.5">{l.email}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {l.source && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {l.source.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{formatDate(l.dateadded)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/leads/${l._id}`}
                        className="flex-1 text-xs text-gray-400 hover:text-blue-600 text-center py-0.5 rounded hover:bg-blue-50"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => openEdit(l)}
                        className="flex-1 text-xs text-gray-400 hover:text-blue-600 text-center py-0.5 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(l)}
                        className="flex-1 text-xs text-gray-400 hover:text-red-600 text-center py-0.5 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Unassigned column */}
          {unassigned.length > 0 && (
            <div className="flex-shrink-0 w-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-gray-100 text-gray-600 text-xs">Unassigned</span>
                <span className="text-xs text-gray-500">{unassigned.length}</span>
              </div>
              <div className="space-y-2">
                {unassigned.map(l => (
                  <div key={l._id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <p className="text-sm font-medium text-gray-900 truncate">{l.name}</p>
                    {l.company && <p className="text-xs text-gray-400 truncate">{l.company}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">{editingLead ? 'Edit Lead' : 'New Lead'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input
                    className="form-input"
                    placeholder="Full name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Company</label>
                  <input
                    className="form-input"
                    placeholder="Company name"
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    placeholder="+1 234 567 8900"
                    value={form.phonenumber}
                    onChange={e => setForm(f => ({ ...f, phonenumber: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="">Select status</option>
                    {statuses.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Source</label>
                  <select
                    className="form-select"
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  >
                    <option value="">Select source</option>
                    {sources.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <input
                    className="form-input"
                    placeholder="Street address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    placeholder="Country"
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  />
                </div>
                <div className="col-span-2">
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
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving...' : editingLead ? 'Update Lead' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Lead</h2>
            <p className="text-gray-600 mb-6">
              Delete lead <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? This cannot be undone.
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
