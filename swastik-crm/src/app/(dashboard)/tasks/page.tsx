'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, CheckSquare, Edit, Trash2, LayoutGrid, List, X, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Task {
  _id: string;
  name: string;
  description?: string;
  project?: { _id: string; name: string } | null;
  assigned?: { _id: string; firstname: string; lastname: string }[];
  priority: number;
  status: number;
  duedate?: string;
  billable?: boolean;
  hourly_rate?: number;
}

const PRIORITY_LABELS = ['', 'Low', 'Medium', 'High', 'Urgent'];
const PRIORITY_COLORS: Record<number, string> = {
  1: 'bg-gray-100 text-gray-600',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-orange-100 text-orange-700',
  4: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = ['', 'Not Started', 'In Progress', 'Testing', 'Awaiting Feedback', 'Complete'];
const STATUS_COLORS: Record<number, string> = {
  1: 'bg-gray-100 text-gray-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-purple-100 text-purple-700',
  4: 'bg-yellow-100 text-yellow-700',
  5: 'bg-green-100 text-green-700',
};
const STATUS_BG: Record<number, string> = {
  1: 'bg-gray-50 border-gray-200',
  2: 'bg-blue-50 border-blue-200',
  3: 'bg-purple-50 border-purple-200',
  4: 'bg-yellow-50 border-yellow-200',
  5: 'bg-green-50 border-green-200',
};

const EMPTY_FORM = {
  name: '', description: '', project: '', priority: '2', status: '1',
  duedate: '', billable: false, hourly_rate: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<{ _id: string; name: string }[]>([]);
  const [staff, setStaff] = useState<{ _id: string; firstname: string; lastname: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const fetchTasks = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/tasks?${params}`)
      .then(r => r.json())
      .then(d => {
        setTasks(d.data || []);
        setTotal(d.pagination?.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
    fetch('/api/projects?limit=100').then(r => r.json()).then(d => setProjects(d.data || []));
    fetch('/api/staff?limit=100').then(r => r.json()).then(d => setStaff(d.data || []));
  }, [page, statusFilter]);

  const filtered = tasks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditingTask(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setForm({
      name: t.name,
      description: t.description || '',
      project: (t.project as { _id: string } | null | undefined)?._id || '',
      priority: String(t.priority),
      status: String(t.status),
      duedate: t.duedate ? t.duedate.split('T')[0] : '',
      billable: t.billable || false,
      hourly_rate: String(t.hourly_rate || ''),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';
    const payload = {
      ...form,
      priority: parseInt(form.priority),
      status: parseInt(form.status),
      hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : 0,
    };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowModal(false);
      fetchTasks();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/tasks/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchTasks();
  };

  const handleStatusChange = async (taskId: string, newStatus: number) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks();
  };

  // Kanban grouping
  const kanbanColumns = [1, 2, 3, 4, 5].map(s => ({
    status: s,
    label: STATUS_LABELS[s],
    tasks: filtered.filter(t => t.status === s),
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{total} total tasks</p>
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
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select w-44"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          {STATUS_LABELS.slice(1).map((label, i) => (
            <option key={i + 1} value={String(i + 1)}>{label}</option>
          ))}
        </select>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="card">
          <div className="card-header">
            <span className="font-semibold text-gray-700">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
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
              <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No tasks found</p>
              <p className="text-sm text-gray-400 mt-1">Create your first task to get started</p>
              <button onClick={openAdd} className="btn-primary mt-4 mx-auto">
                <Plus className="w-4 h-4" /> New Task
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Project</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t._id}>
                      <td>
                        <div>
                          <p className="font-medium text-gray-900">{t.name}</p>
                          {t.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{t.description}</p>}
                        </div>
                      </td>
                      <td className="text-gray-500 text-sm">{t.project?.name || '—'}</td>
                      <td className="text-gray-500 text-sm">
                        {t.assigned?.map(a => `${a.firstname} ${a.lastname}`).join(', ') || '—'}
                      </td>
                      <td>
                        <span className={`badge ${PRIORITY_COLORS[t.priority] || 'bg-gray-100 text-gray-600'}`}>
                          {PRIORITY_LABELS[t.priority] || 'Medium'}
                        </span>
                      </td>
                      <td>
                        <select
                          className="text-xs rounded-full px-2 py-0.5 border-0 cursor-pointer font-medium"
                          style={{ background: 'transparent' }}
                          value={t.status}
                          onChange={e => handleStatusChange(t._id, parseInt(e.target.value))}
                        >
                          {STATUS_LABELS.slice(1).map((label, i) => (
                            <option key={i + 1} value={i + 1}>{label}</option>
                          ))}
                        </select>
                        <span className={`badge ${STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-600'} ml-1`}>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </td>
                      <td className={`text-sm ${t.duedate && new Date(t.duedate) < new Date() && t.status !== 5 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {t.duedate ? formatDate(t.duedate) : '—'}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
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
              key={col.status}
              className={`flex-shrink-0 w-64 rounded-xl border-2 ${STATUS_BG[col.status]} p-3`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`badge ${STATUS_COLORS[col.status]}`}>{col.label}</span>
                  <span className="text-xs text-gray-500 font-medium">{col.tasks.length}</span>
                </div>
                <button
                  onClick={openAdd}
                  className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Cards */}
              <div className="space-y-2">
                {col.tasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs">No tasks</div>
                ) : col.tasks.map(t => (
                  <div key={t._id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{t.name}</p>
                    {t.project && (
                      <p className="text-xs text-gray-400 mt-1">{t.project.name}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className={`badge text-xs ${PRIORITY_COLORS[t.priority] || 'bg-gray-100 text-gray-600'}`}>
                        {PRIORITY_LABELS[t.priority] || 'Medium'}
                      </span>
                      {t.duedate && (
                        <span className={`text-xs ${new Date(t.duedate) < new Date() && t.status !== 5 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                          {formatDate(t.duedate)}
                        </span>
                      )}
                    </div>
                    {t.assigned && t.assigned.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {t.assigned.slice(0, 3).map(a => (
                          <div
                            key={a._id}
                            className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold"
                            title={`${a.firstname} ${a.lastname}`}
                          >
                            {a.firstname?.[0]}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(t)}
                        className="flex-1 text-xs text-gray-400 hover:text-blue-600 text-center py-0.5 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
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
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Task Name *</label>
                <input
                  className="form-input"
                  placeholder="Enter task name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Task description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                    <option value="4">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="1">Not Started</option>
                    <option value="2">In Progress</option>
                    <option value="3">Testing</option>
                    <option value="4">Awaiting Feedback</option>
                    <option value="5">Complete</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Project</label>
                  <select className="form-select" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}>
                    <option value="">No Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={form.duedate} onChange={e => setForm(f => ({ ...f, duedate: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="billable"
                    checked={Boolean(form.billable)}
                    onChange={e => setForm(f => ({ ...f, billable: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <label htmlFor="billable" className="text-sm text-gray-700">Billable</label>
                </div>
                {form.billable && (
                  <div className="flex-1">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Hourly rate"
                      value={form.hourly_rate}
                      onChange={e => setForm(f => ({ ...f, hourly_rate: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Task</h2>
            <p className="text-gray-600 mb-6">
              Delete task <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? This cannot be undone.
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
