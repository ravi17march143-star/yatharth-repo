'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface Contract {
  _id: string;
  subject: string;
  client?: { _id: string; company: string };
  contract_type?: { name: string };
  start_date: string;
  end_date: string;
  value: number;
  signed: number;
  status: string;
}

const EMPTY_FORM = {
  subject: '', client: '', contract_type: '', start_date: '', end_date: '', value: '', description: '',
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<{ _id: string; company: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [signedFilter, setSignedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchContracts = () => {
    setLoading(true);
    fetch('/api/contracts')
      .then(r => r.json())
      .then(data => setContracts(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContracts();
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d.data || []));
  }, []);

  const filtered = contracts.filter(c => {
    const matchSearch = c.subject?.toLowerCase().includes(search.toLowerCase()) || c.client?.company?.toLowerCase().includes(search.toLowerCase());
    const matchSigned = signedFilter === 'all' || (signedFilter === 'signed' ? c.signed === 1 : c.signed !== 1);
    return matchSearch && matchSigned;
  });

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/contracts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setShowModal(false);
    fetchContracts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/contracts/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchContracts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage client contracts and agreements</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-2xl font-bold">{contracts.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Contracts</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-green-600">{contracts.filter(c => c.signed === 1).length}</p>
          <p className="text-sm text-gray-500 mt-1">Signed</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-yellow-600">{contracts.filter(c => c.signed !== 1).length}</p>
          <p className="text-sm text-gray-500 mt-1">Pending Signature</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold">{formatCurrency(contracts.reduce((s, c) => s + (c.value || 0), 0))}</p>
          <p className="text-sm text-gray-500 mt-1">Total Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="form-input pl-10" placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" value={signedFilter} onChange={e => setSignedFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="signed">Signed</option>
              <option value="unsigned">Not Signed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{filtered.length} Contract{filtered.length !== 1 ? 's' : ''}</span>
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
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Value</th>
                    <th>Signed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-gray-400">No contracts found</td></tr>
                  ) : filtered.map(contract => (
                    <tr key={contract._id}>
                      <td>
                        <Link href={`/contracts/${contract._id}`} className="font-medium text-blue-600 hover:underline">{contract.subject}</Link>
                      </td>
                      <td>
                        {contract.client ? (
                          <Link href={`/clients/${contract.client._id}`} className="text-gray-700 hover:text-blue-600 text-sm">{contract.client.company}</Link>
                        ) : '—'}
                      </td>
                      <td className="text-sm text-gray-500">{contract.contract_type?.name || '—'}</td>
                      <td>{formatDate(contract.start_date)}</td>
                      <td>{formatDate(contract.end_date)}</td>
                      <td className="font-medium">{contract.value ? formatCurrency(contract.value) : '—'}</td>
                      <td>
                        {contract.signed === 1
                          ? <span className="badge bg-green-100 text-green-800">Signed</span>
                          : <span className="badge bg-yellow-100 text-yellow-800">Pending</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/contracts/${contract._id}`} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></Link>
                          <button className="p-1 text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteTarget(contract)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">New Contract</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input className="form-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select className="form-select" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}>
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.company}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input className="form-input" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input className="form-input" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value</label>
                <input className="form-input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create Contract'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Contract</h2>
            <p className="text-gray-600 mb-6">Delete contract <strong>{deleteTarget.subject}</strong>?</p>
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
