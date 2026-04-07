'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, FileText, ArrowLeft, Download, ExternalLink, LogOut } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PortalClient { _id: string; company: string; }
interface Invoice {
  _id: string; prefix: string; number: number; total: number;
  status: number; date: string; due_date: string; subtotal: number; total_tax: number;
}

const STATUS_LABEL: Record<number, string> = { 1: 'Unpaid', 2: 'Paid', 3: 'Partial', 4: 'Overdue', 5: 'Cancelled', 6: 'Draft' };
const STATUS_CLS: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-700', 2: 'bg-green-100 text-green-700',
  3: 'bg-blue-100 text-blue-700', 4: 'bg-red-100 text-red-700',
  5: 'bg-gray-100 text-gray-600', 6: 'bg-slate-100 text-slate-600',
};

export default function PortalInvoicesPage() {
  const router = useRouter();
  const [client, setClient] = useState<PortalClient | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchInvoices = useCallback(async (c: PortalClient) => {
    const res = await fetch(`/api/portal/invoices?clientId=${c._id}`);
    const data = await res.json();
    setInvoices(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('portal_client');
    if (!stored) { router.push('/portal/login'); return; }
    const c = JSON.parse(stored) as PortalClient;
    setClient(c);
    fetchInvoices(c);
  }, [router, fetchInvoices]);

  const filtered = invoices.filter(inv => filter === 'all' || inv.status === parseInt(filter));

  const totalUnpaid = invoices.filter(i => i.status === 1 || i.status === 4).reduce((s, i) => s + i.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Swastik CRM <span className="text-gray-400 font-normal">| Client Portal</span></span>
          </div>
          <button onClick={() => { sessionStorage.removeItem('portal_client'); router.push('/portal/login'); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/portal/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invoices</h1>
            <p className="text-sm text-gray-500">{client?.company}</p>
          </div>
        </div>

        {/* Summary */}
        {totalUnpaid > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-800">Outstanding Balance</p>
                <p className="text-sm text-orange-600">You have unpaid invoices totaling {formatCurrency(totalUnpaid)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[['all', 'All'], ['1', 'Unpaid'], ['2', 'Paid'], ['4', 'Overdue']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === val ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading invoices...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No invoices found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(inv => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {inv.prefix}-{String(inv.number).padStart(5, '0')}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(inv.date)}</td>
                    <td className={`px-6 py-4 ${inv.status === 4 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(inv.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${STATUS_CLS[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[inv.status] || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/portal/invoices/${inv._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
