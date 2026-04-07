'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Users, FolderOpen } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Project {
  _id: string;
  name: string;
  description: string;
  client?: { _id: string; company: string };
  status: string;
  progress: number;
  start_date: string;
  deadline: string;
  billing_type?: string;
  budget?: number;
  members?: { _id: string; name: string }[];
}

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'On Hold', 'Finished'];

const BILLING_TYPES = ['Fixed Rate', 'Project Hours', 'Task Hours'];

const STATUS_COLORS: Record<string, string> = {
  'Not Started': 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-800',
  'On Hold': 'bg-yellow-100 text-yellow-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Finished': 'bg-green-100 text-green-800',
};

const PROGRESS_COLORS: Record<string, string> = {
  'Not Started': 'bg-gray-400',
  'In Progress': 'bg-blue-500',
  'On Hold': 'bg-yellow-500',
  'Cancelled': 'bg-red-500',
  'Finished': 'bg-green-500',
};

const EMPTY_FORM = {
  name: '',
  description: '',
  client: '',
  status: 'Not Started',
  start_date: '',
  deadline: '',
  billing_type: 'Fixed Rate',
  budget: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<{ _id: string; company: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d.data || []));
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm({
      name: p.name,
      description: p.description || '',
      client: p.client?._id || '',
      status: p.status,
      start_date: p.start_date ? p.start_date.split('T')[0] : '',
      deadline: p.deadline ? p.deadline.split('T')[0] : '',
      billing_type: p.billing_type || 'Fixed Rate',
      budget: p.budget ? String(p.budget) : '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
    const method = editingProject ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
      }),
    });
    setSaving(false);
    setShowModal(false);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/projects/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Track all your ongoing and completed projects</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          All ({projects.length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {s} ({projects.filter(p => p.status === s).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="form-input pl-10"
              placeholder="Search projects by name or client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">
            {filtered.length} Project{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FolderOpen className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">No projects found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Billing</th>
                    <th>Budget</th>
                    <th>Start Date</th>
                    <th>Deadline</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(proj => (
                    <tr key={proj._id}>
                      <td>
                        <Link href={`/projects/${proj._id}`} className="font-medium text-blue-600 hover:underline">
                          {proj.name}
                        </Link>
                      </td>
                      <td>
                        {proj.client ? (
                          <Link href={`/clients/${proj.client._id}`} className="text-gray-700 hover:text-blue-600 text-sm">
                            {proj.client.company}
                          </Link>
                        ) : '—'}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[proj.status] || 'bg-gray-100 text-gray-800'}`}>
                          {proj.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 min-w-[110px]">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${PROGRESS_COLORS[proj.status] || 'bg-blue-500'}`}
                              style={{ width: `${proj.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">{proj.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="text-sm text-gray-600">{proj.billing_type || '—'}</td>
                      <td className="text-sm">
                        {proj.budget ? (
                          <span className="font-medium">{formatCurrency(proj.budget)}</span>
                        ) : '—'}
                      </td>
                      <td className="whitespace-nowrap">{formatDate(proj.start_date)}</td>
                      <td className="whitespace-nowrap">{formatDate(proj.deadline)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            {proj.members?.slice(0, 3).map(m => (
                              <div
                                key={m._id}
                                className="w-7 h-7 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-blue-700"
                                title={m.name}
                              >
                                {m.name?.[0]?.toUpperCase()}
                              </div>
                            ))}
                          </div>
                          {(proj.members?.length || 0) > 0 && (
                            <span className="text-xs text-gray-500 ml-1 flex items-center gap-1">
                              <Users className="w-3 h-3" />{proj.members?.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/projects/${proj._id}`} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEdit(proj)} className="p-1 text-gray-400 hover:text-yellow-600 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(proj)} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Project Name *</label>
                <input
                  className="form-input"
                  placeholder="Enter project name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Project description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  value={form.client}
                  onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                >
                  <option value="">No Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.company}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Deadline</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Billing Type</label>
                <select
                  className="form-select"
                  value={form.billing_type}
                  onChange={e => setForm(f => ({ ...f, billing_type: e.target.value }))}
                >
                  {BILLING_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Budget</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="btn-primary">
                {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Project</h2>
            <p className="text-gray-600 mb-6">
              Delete project <strong>{deleteTarget.name}</strong>? All tasks and milestones will be removed. This cannot be undone.
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
