'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Send, Download, Copy } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface EstimateItem {
  description: string;
  qty: number;
  rate: number;
  tax: number;
  amount: number;
}

interface Estimate {
  _id: string;
  prefix: string;
  number: number;
  client?: { _id: string; company: string; address: string; city: string; country: string };
  items: EstimateItem[];
  subtotal: number;
  discount: number;
  discount_type: string;
  tax: number;
  total: number;
  date: string;
  expirydate: string;
  status: number;
  note: string;
  terms: string;
}

const STATUS_LABELS = ['Draft', 'Sent', 'Declined', 'Accepted', 'Expired'];
const STATUS_KEYS = ['draft', 'sent', 'cancelled', 'active', 'overdue'];

export default function EstimateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/estimates/${id}`)
      .then(r => r.json())
      .then(data => setEstimate(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card"><div className="card-body h-64 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Estimate not found.</p>
        <Link href="/estimates" className="btn-primary mt-4 inline-block">Back</Link>
      </div>
    );
  }

  const estimateNum = `${estimate.prefix}-${String(estimate.number).padStart(5, '0')}`;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/estimates" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Estimate {estimateNum}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Created {formatDate(estimate.date)}</p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${getStatusColor(STATUS_KEYS[estimate.status] || 'draft')}`}>
          {STATUS_LABELS[estimate.status]}
        </span>
        <button className="btn-secondary flex items-center gap-2"><Send className="w-4 h-4" /> Send</button>
        <Link href={`/estimates/${id}/edit`} className="btn-secondary flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Link>
        <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> PDF</button>
        <button className="btn-secondary flex items-center gap-2"><Copy className="w-4 h-4" /> Convert to Invoice</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-body">
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">ESTIMATE</h2>
                  <p className="text-gray-500 text-sm mt-1"># {estimateNum}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date: <span className="text-gray-800">{formatDate(estimate.date)}</span></p>
                  <p className="text-sm text-gray-500">Expiry: <span className="text-gray-800">{formatDate(estimate.expirydate)}</span></p>
                </div>
              </div>

              {estimate.client && (
                <div className="mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Prepared For</p>
                  <p className="font-semibold">{estimate.client.company}</p>
                  <p className="text-sm text-gray-500">{estimate.client.address}</p>
                  <p className="text-sm text-gray-500">{[estimate.client.city, estimate.client.country].filter(Boolean).join(', ')}</p>
                </div>
              )}

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
                    {estimate.items?.map((item, i) => (
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

              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(estimate.subtotal)}</span>
                  </div>
                  {estimate.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-red-600">-{estimate.discount_type === 'percent' ? `${estimate.discount}%` : formatCurrency(estimate.discount)}</span>
                    </div>
                  )}
                  {estimate.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span>{formatCurrency(estimate.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(estimate.total)}</span>
                  </div>
                </div>
              </div>

              {estimate.note && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Note</p>
                  <p className="text-sm text-gray-600">{estimate.note}</p>
                </div>
              )}
              {estimate.terms && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Terms</p>
                  <p className="text-sm text-gray-600">{estimate.terms}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Summary</h3></div>
            <div className="card-body space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold">{formatCurrency(estimate.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`badge ${getStatusColor(STATUS_KEYS[estimate.status] || 'draft')}`}>{STATUS_LABELS[estimate.status]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expiry</span>
                <span>{formatDate(estimate.expirydate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
