'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Send, Download, Plus, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
  tax: number;
  amount: number;
}

interface Payment {
  _id: string;
  amount: number;
  date: string;
  payment_mode: string;
  note: string;
}

interface Invoice {
  _id: string;
  prefix: string;
  number: number;
  client: { _id: string; company: string; address: string; city: string; country: string };
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discount_type: string;
  tax: number;
  total: number;
  date: string;
  due_date: string;
  status: number;
  note: string;
  terms: string;
  payments?: Payment[];
}

const STATUS_LABELS = ['Draft', 'Unpaid', 'Paid', 'Overdue', 'Cancelled'];
const STATUS_KEYS = ['draft', 'unpaid', 'paid', 'overdue', 'cancelled'];

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: '', date: '', payment_mode: 'Bank Transfer', note: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then(r => r.json())
      .then(data => setInvoice(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRecordPayment = async () => {
    setSaving(true);
    await fetch(`/api/invoices/${id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentForm),
    });
    setSaving(false);
    setShowPaymentModal(false);
    fetch(`/api/invoices/${id}`).then(r => r.json()).then(data => setInvoice(data.data));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card"><div className="card-body h-64 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Invoice not found.</p>
        <Link href="/invoices" className="btn-primary mt-4 inline-block">Back to Invoices</Link>
      </div>
    );
  }

  const invoiceNum = `${invoice.prefix}-${String(invoice.number).padStart(5, '0')}`;
  const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const balance = invoice.total - totalPaid;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/invoices" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Invoice {invoiceNum}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Issued {formatDate(invoice.date)}</p>
        </div>
        <span className={`badge ${getStatusColor(STATUS_KEYS[invoice.status] || 'draft')} text-sm px-3 py-1`}>
          {STATUS_LABELS[invoice.status]}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setShowPaymentModal(true)} className="btn-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Record Payment
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Send className="w-4 h-4" /> Send
          </button>
          <Link href={`/invoices/${id}/edit`} className="btn-secondary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-body">
              {/* Invoice Header */}
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                  <p className="text-gray-500 text-sm mt-1"># {invoiceNum}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Issue Date: <span className="text-gray-800">{formatDate(invoice.date)}</span></p>
                  <p className="text-sm text-gray-500">Due Date: <span className={`font-medium ${invoice.status === 3 ? 'text-red-600' : 'text-gray-800'}`}>{formatDate(invoice.due_date)}</span></p>
                </div>
              </div>

              {/* Bill To */}
              {invoice.client && (
                <div className="mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Bill To</p>
                  <p className="font-semibold text-gray-800">{invoice.client.company}</p>
                  <p className="text-sm text-gray-500">{invoice.client.address}</p>
                  <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.country].filter(Boolean).join(', ')}</p>
                </div>
              )}

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-600">Description</th>
                      <th className="text-right p-3 font-semibold text-gray-600">Qty</th>
                      <th className="text-right p-3 font-semibold text-gray-600">Rate</th>
                      <th className="text-right p-3 font-semibold text-gray-600">Tax</th>
                      <th className="text-right p-3 font-semibold text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.qty}</td>
                        <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                        <td className="p-3 text-right">{item.tax}%</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-red-600">-{invoice.discount_type === 'percent' ? `${invoice.discount}%` : formatCurrency(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span>{formatCurrency(invoice.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                  {totalPaid > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Paid</span>
                        <span className="text-green-600">-{formatCurrency(totalPaid)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold">
                        <span>Balance Due</span>
                        <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>{formatCurrency(balance)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Note / Terms */}
              {invoice.note && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Note</p>
                  <p className="text-sm text-gray-600">{invoice.note}</p>
                </div>
              )}
              {invoice.terms && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Terms & Conditions</p>
                  <p className="text-sm text-gray-600">{invoice.terms}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Summary</h3></div>
            <div className="card-body space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Invoice Total</span>
                <span className="font-medium">{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t pt-3">
                <span>Balance Due</span>
                <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>{formatCurrency(balance)}</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Payment History</h3>
              <button onClick={() => setShowPaymentModal(true)} className="text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="card-body">
              {invoice.payments?.length ? (
                <div className="space-y-3">
                  {invoice.payments.map(p => (
                    <div key={p._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(p.date)} · {p.payment_mode}</p>
                        {p.note && <p className="text-xs text-gray-400">{p.note}</p>}
                      </div>
                      <span className="badge bg-green-100 text-green-800">Paid</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No payments recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Record Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input className="form-input" type="number" placeholder={formatCurrency(balance)} value={paymentForm.amount}
                  onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
                <input className="form-input" type="date" value={paymentForm.date}
                  onChange={e => setPaymentForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                <select className="form-select" value={paymentForm.payment_mode}
                  onChange={e => setPaymentForm(f => ({ ...f, payment_mode: e.target.value }))}>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea className="form-input" rows={2} value={paymentForm.note}
                  onChange={e => setPaymentForm(f => ({ ...f, note: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowPaymentModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleRecordPayment} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
