'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, CreditCard, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

interface PaymentItem {
  _id: string;
  amount: number;
  date: string;
  transactionid: string;
  note: string;
  invoice: { prefix: string; number: number; _id: string; client: { company: string } } | null;
  paymentmethod: { _id: string; name: string } | null;
}

interface InvoiceOption {
  _id: string;
  prefix: string;
  number: number;
  client: { company: string } | null;
}

interface PaymentMode {
  _id: string;
  name: string;
}

const EMPTY_FORM = {
  invoice: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  paymentmethod: '',
  transactionid: '',
  note: '',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [thisMonthAmount, setThisMonthAmount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [invoices, setInvoices] = useState<InvoiceOption[]>([]);
  const [modes, setModes] = useState<PaymentMode[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<PaymentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPayments = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    fetch(`/api/payments?${params}`)
      .then(r => r.json())
      .then(d => {
        const data: PaymentItem[] = d.data || [];
        setPayments(data);
        setTotalPages(d.pagination?.pages || 1);
        setTotal(d.pagination?.total || 0);
        setTotalAmount(d.totalAmount || 0);

        const now = new Date();
        const thisMonth = data
          .filter(p => {
            const d = new Date(p.date);
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
          })
          .reduce((sum, p) => sum + p.amount, 0);
        setThisMonthAmount(thisMonth);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/invoices?status=unpaid').then(r => r.json()).then(d => setInvoices(d.data || []));
    fetch('/api/payments/modes').then(r => r.json()).then(d => setModes(d.data || []));
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const filtered = payments.filter(p =>
    !search ||
    p.invoice?.client?.company?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionid?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
    setFormError('');
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.invoice) { setFormError('Please select an invoice.'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setFormError('A valid amount is required.'); return; }
    if (!form.date) { setFormError('Payment date is required.'); return; }
    setFormError('');
    setSaving(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || 'Failed to record payment.');
        return;
      }
      setShowModal(false);
      fetchPayments();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/payments/${deleteTarget._id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchPayments();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">{total} payments recorded</p>
        </div>
        <button onClick={openModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Payments</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(thisMonthAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="form-input pl-10"
              placeholder="Search by client or transaction..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{total} Payment{total !== 1 ? 's' : ''}</span>
          <span className="text-sm text-gray-500">Total: {formatCurrency(totalAmount)}</span>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CreditCard} title="No Payments" description="No payments recorded yet." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td>
                        {p.invoice ? (
                          <Link href={`/invoices/${p.invoice._id}`} className="font-medium text-blue-600 hover:underline">
                            {p.invoice.prefix}-{String(p.invoice.number).padStart(5, '0')}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="text-gray-600">{p.invoice?.client?.company || '—'}</td>
                      <td className="font-semibold text-green-700">{formatCurrency(p.amount)}</td>
                      <td className="text-gray-500">{p.paymentmethod?.name || '—'}</td>
                      <td className="text-gray-400 font-mono text-xs">{p.transactionid || '—'}</td>
                      <td className="text-gray-400 text-sm">{formatDate(p.date)}</td>
                      <td className="text-gray-500 text-sm max-w-xs truncate">{p.note || '—'}</td>
                      <td>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={total}
              itemsPerPage={20}
            />
          </>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Record Payment"
        size="lg"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Record Payment'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="form-label">Invoice <span className="text-red-500">*</span></label>
            <select
              className="form-select"
              value={form.invoice}
              onChange={e => setForm(f => ({ ...f, invoice: e.target.value }))}
            >
              <option value="">Select Invoice</option>
              {invoices.map(inv => (
                <option key={inv._id} value={inv._id}>
                  {inv.prefix}-{String(inv.number).padStart(5, '0')}
                  {inv.client ? ` — ${inv.client.company}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Amount <span className="text-red-500">*</span></label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Date <span className="text-red-500">*</span></label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Payment Mode</label>
            <select
              className="form-select"
              value={form.paymentmethod}
              onChange={e => setForm(f => ({ ...f, paymentmethod: e.target.value }))}
            >
              <option value="">Select Mode</option>
              {modes.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Transaction ID</label>
            <input
              className="form-input"
              placeholder="Transaction reference"
              value={form.transactionid}
              onChange={e => setForm(f => ({ ...f, transactionid: e.target.value }))}
            />
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Additional notes..."
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Payment</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this payment of{' '}
              <strong>{formatCurrency(deleteTarget.amount)}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
