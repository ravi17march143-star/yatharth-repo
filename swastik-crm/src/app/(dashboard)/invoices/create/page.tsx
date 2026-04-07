'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Save, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Client { _id: string; company: string; }
interface Tax { _id: string; name: string; taxrate: number; }
interface Currency { id: number; name: string; symbol: string; iso_code: string; }

interface LineItem {
  description: string;
  long_description: string;
  qty: number;
  rate: number;
  taxname: string[];
  taxrate: number[];
  unit: string;
}

const CURRENCIES: Currency[] = [
  { id: 1, name: 'Indian Rupee', symbol: '₹', iso_code: 'INR' },
  { id: 2, name: 'US Dollar', symbol: '$', iso_code: 'USD' },
  { id: 3, name: 'Euro', symbol: '€', iso_code: 'EUR' },
  { id: 4, name: 'British Pound', symbol: '£', iso_code: 'GBP' },
  { id: 5, name: 'Australian Dollar', symbol: 'A$', iso_code: 'AUD' },
];

export default function CreateInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');

  const [form, setForm] = useState({
    client: '',
    date: new Date().toISOString().slice(0, 10),
    duedate: '',
    status: 6,
    currency: 1,
    discount_percent: 0,
    discount_type: 'percent' as 'percent' | 'fixed',
    adjustment: 0,
    clientnote: '',
    adminnote: '',
    terms: '',
  });

  const [items, setItems] = useState<LineItem[]>([
    { description: '', long_description: '', qty: 1, rate: 0, taxname: [], taxrate: [], unit: '' },
  ]);

  useEffect(() => {
    fetch('/api/clients?limit=200')
      .then(r => r.json())
      .then(d => setClients(d.data || []));

    fetch('/api/taxes')
      .then(r => r.json())
      .then(d => setTaxes(d.data || []));

    // Get next invoice number suggestion
    fetch('/api/invoices?limit=1')
      .then(r => r.json())
      .then(d => {
        const lastNum = d.data?.[0]?.number || 0;
        const prefix = d.data?.[0]?.prefix || 'INV';
        setInvoicePrefix(prefix);
        setInvoiceNumber(String(lastNum + 1).padStart(4, '0'));
      })
      .catch(() => setInvoiceNumber('0001'));
  }, []);

  const addItem = () => {
    setItems([...items, { description: '', long_description: '', qty: 1, rate: 0, taxname: [], taxrate: [], unit: '' }]);
  };

  const removeItem = (i: number) => {
    if (items.length > 1) setItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, field: string, value: unknown) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const handleTaxChange = (i: number, taxId: string) => {
    if (!taxId) {
      updateItem(i, 'taxname', []);
      updateItem(i, 'taxrate', []);
      return;
    }
    const tax = taxes.find(t => t._id === taxId);
    if (tax) {
      const updated = [...items];
      updated[i] = { ...updated[i], taxname: [tax.name], taxrate: [tax.taxrate] };
      setItems(updated);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discountAmount =
    form.discount_type === 'percent'
      ? (subtotal * form.discount_percent) / 100
      : form.discount_percent;
  const totalTax = items.reduce((sum, item) => {
    const itemTotal = item.qty * item.rate;
    return sum + item.taxrate.reduce((tsum, rate) => tsum + (itemTotal * rate) / 100, 0);
  }, 0);
  const total = subtotal - discountAmount + totalTax + Number(form.adjustment);

  const selectedCurrency = CURRENCIES.find(c => c.id === form.currency) || CURRENCIES[0];

  const handleSubmit = async (e: React.FormEvent, sendNow = false) => {
    e.preventDefault();
    if (!form.client) {
      alert('Please select a client.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items,
          number: parseInt(invoiceNumber, 10) || 1,
          prefix: invoicePrefix,
          status: sendNow ? 1 : form.status,
          subtotal,
          total_tax: totalTax,
          total,
          discount_total: discountAmount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/invoices/${data.data._id}`);
      } else {
        alert(data.error || 'Failed to create invoice.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="page-title mb-0">New Invoice</h1>
          <p className="page-subtitle mb-0">Create a new invoice for your client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Client Information */}
            <div className="card card-body">
              <h3 className="font-semibold text-gray-800 mb-4">Client Information</h3>
              <div>
                <label className="form-label">Client *</label>
                <select
                  className="form-select"
                  value={form.client}
                  onChange={e => setForm({ ...form, client: e.target.value })}
                  required
                >
                  <option value="">Select client...</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-gray-800">Invoice Items</h3>
                <button type="button" onClick={addItem} className="btn-secondary text-xs">
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-5/12">
                        Description
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-1/12">
                        Qty
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-2/12">
                        Unit Price
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 w-2/12">
                        Tax
                      </th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-600 w-2/12">
                        Amount
                      </th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">
                          <input
                            className="form-input mb-1.5"
                            placeholder="Item name *"
                            value={item.description}
                            onChange={e => updateItem(i, 'description', e.target.value)}
                            required
                          />
                          <input
                            className="form-input text-xs text-gray-400"
                            placeholder="Additional description (optional)"
                            value={item.long_description}
                            onChange={e => updateItem(i, 'long_description', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="form-input w-16"
                            min="0.01"
                            step="0.01"
                            value={item.qty}
                            onChange={e => updateItem(i, 'qty', Number(e.target.value))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="form-input w-28"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={e => updateItem(i, 'rate', Number(e.target.value))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="form-select w-28 text-xs"
                            onChange={e => handleTaxChange(i, e.target.value)}
                          >
                            <option value="">No Tax</option>
                            {taxes.map(t => (
                              <option key={t._id} value={t._id}>
                                {t.name} ({t.taxrate}%)
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                          {selectedCurrency.symbol}
                          {(item.qty * item.rate).toFixed(2)}
                        </td>
                        <td className="px-2 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            disabled={items.length === 1}
                            className="text-red-400 hover:text-red-600 p-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 p-4">
                <div className="ml-auto max-w-xs space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      {selectedCurrency.symbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>
                        Discount
                        {form.discount_type === 'percent' ? ` (${form.discount_percent}%)` : ''}
                      </span>
                      <span>
                        -{selectedCurrency.symbol}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {totalTax > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>
                        {selectedCurrency.symbol}
                        {totalTax.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {Number(form.adjustment) !== 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Adjustment</span>
                      <span>
                        {selectedCurrency.symbol}
                        {Number(form.adjustment).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                    <span>Total</span>
                    <span>
                      {selectedCurrency.symbol}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card card-body">
              <h3 className="font-semibold text-gray-800 mb-4">Notes &amp; Terms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Client Note</label>
                  <textarea
                    className="form-input h-24 resize-none"
                    placeholder="Note visible to client on the invoice..."
                    value={form.clientnote}
                    onChange={e => setForm({ ...form, clientnote: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Admin Note (Internal)</label>
                  <textarea
                    className="form-input h-24 resize-none"
                    placeholder="Internal note — not shown to client..."
                    value={form.adminnote}
                    onChange={e => setForm({ ...form, adminnote: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Terms &amp; Conditions</label>
                  <textarea
                    className="form-input h-20 resize-none"
                    placeholder="Payment terms, conditions, etc."
                    value={form.terms}
                    onChange={e => setForm({ ...form, terms: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Settings */}
          <div className="space-y-4">
            <div className="card card-body space-y-4">
              <h3 className="font-semibold text-gray-800">Invoice Settings</h3>

              {/* Invoice Number */}
              <div>
                <label className="form-label">Invoice Number</label>
                <div className="flex gap-1.5">
                  <input
                    className="form-input w-20 font-mono text-sm text-gray-500"
                    value={invoicePrefix}
                    onChange={e => setInvoicePrefix(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="INV"
                  />
                  <input
                    className="form-input flex-1 font-mono"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    placeholder="0001"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Preview: {invoicePrefix}-{invoiceNumber}
                </p>
              </div>

              {/* Dates */}
              <div>
                <label className="form-label">Invoice Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.duedate}
                  onChange={e => setForm({ ...form, duedate: e.target.value })}
                />
              </div>

              {/* Status */}
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: Number(e.target.value) })}
                >
                  <option value={6}>Draft</option>
                  <option value={1}>Unpaid</option>
                  <option value={2}>Paid</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={form.currency}
                  onChange={e => setForm({ ...form, currency: Number(e.target.value) })}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} {c.iso_code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="form-label">Discount</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    className="form-input flex-1"
                    min="0"
                    step="0.01"
                    max={form.discount_type === 'percent' ? 100 : undefined}
                    value={form.discount_percent}
                    onChange={e =>
                      setForm({ ...form, discount_percent: Number(e.target.value) })
                    }
                  />
                  <select
                    className="form-select w-20 text-xs"
                    value={form.discount_type}
                    onChange={e =>
                      setForm({
                        ...form,
                        discount_type: e.target.value as 'percent' | 'fixed',
                        discount_percent: 0,
                      })
                    }
                  >
                    <option value="percent">%</option>
                    <option value="fixed">{selectedCurrency.symbol}</option>
                  </select>
                </div>
              </div>

              {/* Adjustment */}
              <div>
                <label className="form-label">Adjustment</label>
                <input
                  type="number"
                  className="form-input"
                  step="0.01"
                  value={form.adjustment}
                  onChange={e => setForm({ ...form, adjustment: Number(e.target.value) })}
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-400 mt-1">Use negative value for deduction</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={e => handleSubmit(e as unknown as React.FormEvent, true)}
                className="btn-secondary w-full justify-center"
              >
                <Send className="w-4 h-4" />
                Save &amp; Send to Client
              </button>
            </div>

            {/* Summary */}
            <div className="card card-body bg-gray-50 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>
                  {selectedCurrency.symbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Due</span>
                <span>
                  {selectedCurrency.symbol}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
