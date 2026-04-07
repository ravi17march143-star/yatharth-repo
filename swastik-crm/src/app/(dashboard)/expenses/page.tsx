'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, DollarSign, Calendar, TrendingUp, MinusCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Expense {
  _id: string;
  name: string;
  amount: number;
  date: string;
  category: { _id: string; name: string };
  client?: { _id: string; company: string };
  project?: { _id: string; name: string };
  tax?: { _id: string; name: string; taxrate: number };
  note: string;
  billable: boolean;
}

interface Category { _id: string; name: string; }
interface Client { _id: string; company: string; }
interface Project { _id: string; name: string; }
interface Tax { _id: string; name: string; taxrate: number; }

const EMPTY_FORM = {
  name: '',
  amount: '',
  date: '',
  category: '',
  client: '',
  project: '',
  tax: '',
  note: '',
  billable: false,
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchExpenses = () => {
    setLoading(true);
    fetch('/api/expenses')
      .then(r => r.json())
      .then(data => setExpenses(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
    fetch('/api/expenses/categories').then(r => r.json()).then(d => setCategories(d.data || []));
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d.data || []));
    fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.data || []));
    fetch('/api/taxes').then(r => r.json()).then(d => setTaxes(d.data || []));
  }, []);

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const filtered = expenses.filter(e => {
    const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || e.category?._id === categoryFilter;
    const expDate = e.date ? new Date(e.date) : null;
    const matchFrom = !dateFrom || (expDate && expDate >= new Date(dateFrom));
    const matchTo = !dateTo || (expDate && expDate <= new Date(dateTo + 'T23:59:59'));
    return matchSearch && matchCat && matchFrom && matchTo;
  });

  const totalAmount = filtered.reduce((sum, e) => sum + (e.amount || 0), 0);
  const thisMonthAmount = expenses
    .filter(e => e.date && new Date(e.date) >= thisMonthStart)
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const billableAmount = filtered.filter(e => e.billable).reduce((sum, e) => sum + (e.amount || 0), 0);
  const unbillableAmount = filtered.filter(e => !e.billable).reduce((sum, e) => sum + (e.amount || 0), 0);

  const openAdd = () => {
    setEditingExpense(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditingExpense(e);
    setForm({
      name: e.name,
      amount: String(e.amount),
      date: e.date ? e.date.split('T')[0] : '',
      category: e.category?._id || '',
      client: e.client?._id || '',
      project: e.project?._id || '',
      tax: e.tax?._id || '',
      note: e.note || '',
      billable: e.billable,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingExpense ? `/api/expenses/${editingExpense._id}` : '/api/expenses';
    const method = editingExpense ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowModal(false);
    fetchExpenses();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/expenses/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchExpenses();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track and manage business expenses</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">This Month</p>
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Billable</p>
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(billableAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.filter(e => e.billable).length} billable records</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Unbillable</p>
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <MinusCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(unbillableAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.filter(e => !e.billable).length} unbillable records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="form-input pl-10"
                placeholder="Search expenses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                className="form-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 shrink-0">From:</label>
              <input
                type="date"
                className="form-input"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 shrink-0">To:</label>
              <input
                type="date"
                className="form-input"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
            {(dateFrom || dateTo || categoryFilter !== 'all' || search) && (
              <button
                onClick={() => { setSearch(''); setCategoryFilter('all'); setDateFrom(''); setDateTo(''); }}
                className="btn-secondary text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{filtered.length} Expense{filtered.length !== 1 ? 's' : ''}</span>
          <span className="text-sm text-gray-500">Total: {formatCurrency(totalAmount)}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
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
                    <th>Date</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Client / Project</th>
                    <th>Amount</th>
                    <th>Tax</th>
                    <th>Billable</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400">
                        No expenses found
                      </td>
                    </tr>
                  ) : filtered.map(exp => (
                    <tr key={exp._id}>
                      <td className="whitespace-nowrap">{formatDate(exp.date)}</td>
                      <td className="font-medium">{exp.name}</td>
                      <td>
                        {exp.category ? (
                          <span className="badge bg-purple-100 text-purple-800">{exp.category.name}</span>
                        ) : '—'}
                      </td>
                      <td>
                        {exp.client ? (
                          <Link href={`/clients/${exp.client._id}`} className="text-blue-600 hover:underline text-sm">
                            {exp.client.company}
                          </Link>
                        ) : exp.project ? (
                          <Link href={`/projects/${exp.project._id}`} className="text-blue-600 hover:underline text-sm">
                            {exp.project.name}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="font-medium">{formatCurrency(exp.amount)}</td>
                      <td>
                        {exp.tax ? (
                          <span className="text-sm text-gray-600">{exp.tax.name} ({exp.tax.taxrate}%)</span>
                        ) : '—'}
                      </td>
                      <td>
                        {exp.billable
                          ? <span className="badge bg-blue-100 text-blue-800">Billable</span>
                          : <span className="text-gray-400 text-sm">No</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(exp)}
                            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(exp)}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Expense Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Office Supplies"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Additional details..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount *</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Date *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Client (optional)</label>
                <select
                  className="form-select"
                  value={form.client}
                  onChange={e => setForm(f => ({ ...f, client: e.target.value, project: '' }))}
                >
                  <option value="">No Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.company}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Project (optional)</label>
                <select
                  className="form-select"
                  value={form.project}
                  onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
                >
                  <option value="">No Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
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
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="billable"
                  checked={Boolean(form.billable)}
                  onChange={e => setForm(f => ({ ...f, billable: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="billable" className="text-sm text-gray-700">Mark as billable</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.amount || !form.date} className="btn-primary">
                {saving ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Expense</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              This action cannot be undone.
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
