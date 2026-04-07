'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, FileText, DollarSign, FolderKanban, Ticket,
  LogOut, Bell, ChevronRight, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PortalClient {
  _id: string;
  company: string;
  email?: string;
}

interface PortalStats {
  invoices: { total: number; unpaid: number; overdue: number; totalAmount: number };
  projects: { total: number; active: number };
  tickets: { total: number; open: number };
  payments: { total: number; amount: number };
}

export default function PortalDashboardPage() {
  const router = useRouter();
  const [client, setClient] = useState<PortalClient | null>(null);
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<{ _id: string; prefix: string; number: number; total: number; status: number; date: string; due_date: string }[]>([]);
  const [recentTickets, setRecentTickets] = useState<{ _id: string; ticketid: number; subject: string; status: number; priority: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (c: PortalClient) => {
    try {
      const res = await fetch(`/api/portal/dashboard?clientId=${c._id}`);
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.recentInvoices) setRecentInvoices(data.recentInvoices);
      if (data.recentTickets) setRecentTickets(data.recentTickets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('portal_client');
    if (!stored) {
      router.push('/portal/login');
      return;
    }
    const c = JSON.parse(stored) as PortalClient;
    setClient(c);
    fetchData(c);
  }, [router, fetchData]);

  const handleLogout = () => {
    sessionStorage.removeItem('portal_client');
    router.push('/portal/login');
  };

  const invoiceStatusLabel: Record<number, string> = {
    1: 'Unpaid', 2: 'Paid', 3: 'Partial', 4: 'Overdue', 5: 'Cancelled', 6: 'Draft',
  };
  const invoiceStatusCls: Record<number, string> = {
    1: 'bg-yellow-100 text-yellow-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-blue-100 text-blue-700',
    4: 'bg-red-100 text-red-700',
    5: 'bg-gray-100 text-gray-600',
    6: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">Swastik CRM</span>
              <span className="text-gray-400 text-xs ml-1">Client Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
            </button>
            {client && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                  {client.company?.[0]}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{client.company}</span>
              </div>
            )}
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { href: '/portal/dashboard', label: 'Dashboard', icon: Building2 },
              { href: '/portal/invoices', label: 'Invoices', icon: FileText },
              { href: '/portal/projects', label: 'Projects', icon: FolderKanban },
              { href: '/portal/tickets', label: 'Support', icon: Ticket },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-500 transition-all whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {client?.company || 'Client'}
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s an overview of your account</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.invoices.total || 0}</p>
              <p className="text-sm text-gray-500">Total Invoices</p>
              {(stats?.invoices.unpaid || 0) > 0 && (
                <p className="text-xs text-orange-600 mt-1">{stats?.invoices.unpaid} unpaid</p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.payments.amount || 0)}</p>
              <p className="text-sm text-gray-500">Total Paid</p>
              {(stats?.invoices.overdue || 0) > 0 && (
                <p className="text-xs text-red-600 mt-1">{stats?.invoices.overdue} overdue</p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <FolderKanban className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.projects.total || 0}</p>
              <p className="text-sm text-gray-500">Projects</p>
              <p className="text-xs text-blue-600 mt-1">{stats?.projects.active || 0} active</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <Ticket className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.tickets.total || 0}</p>
              <p className="text-sm text-gray-500">Support Tickets</p>
              <p className="text-xs text-orange-600 mt-1">{stats?.tickets.open || 0} open</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Recent Invoices
              </h2>
              <Link href="/portal/invoices" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentInvoices.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">No invoices yet</div>
              ) : recentInvoices.map(inv => (
                <div key={inv._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {inv.prefix}-{String(inv.number).padStart(5, '0')}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(inv.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(inv.total)}</p>
                    <span className={`badge text-xs mt-0.5 ${invoiceStatusCls[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                      {invoiceStatusLabel[inv.status] || 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-600" /> Recent Tickets
              </h2>
              <Link href="/portal/tickets" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTickets.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">No tickets yet</div>
              ) : recentTickets.map(ticket => {
                const tStatusCls: Record<number, string> = {
                  1: 'bg-blue-100 text-blue-700',
                  2: 'bg-cyan-100 text-cyan-700',
                  3: 'bg-green-100 text-green-700',
                  4: 'bg-yellow-100 text-yellow-700',
                  5: 'bg-gray-100 text-gray-700',
                };
                const tStatusLabel: Record<number, string> = {
                  1: 'Open', 2: 'In Progress', 3: 'Answered', 4: 'On Hold', 5: 'Closed',
                };
                return (
                  <div key={ticket._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="font-medium text-gray-900 text-sm truncate">{ticket.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">#{ticket.ticketid} &middot; {formatDate(ticket.date)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`badge text-xs ${tStatusCls[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                        {tStatusLabel[ticket.status] || 'Unknown'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <Link
                href="/portal/tickets"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Ticket className="w-4 h-4" />
                Submit a new support ticket
                <ChevronRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </div>
        </div>

        {/* Account Info + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: '/portal/tickets', label: 'Submit Support Ticket', icon: Ticket, color: 'text-purple-600 bg-purple-50' },
                { href: '/portal/invoices', label: 'View & Pay Invoices', icon: FileText, color: 'text-blue-600 bg-blue-50' },
                { href: '/portal/projects', label: 'View Projects', icon: FolderKanban, color: 'text-green-600 bg-green-50' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-500" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold">{client?.company}</p>
                <p className="text-blue-100 text-xs">{client?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-blue-100 text-xs">Paid Invoices</span>
                </div>
                <p className="font-bold text-lg">{stats?.invoices.total ? stats.invoices.total - stats.invoices.unpaid : 0}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="text-blue-100 text-xs">Unpaid</span>
                </div>
                <p className="font-bold text-lg">{stats?.invoices.unpaid || 0}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-200" />
                  <span className="text-blue-100 text-xs">Active Projects</span>
                </div>
                <p className="font-bold text-lg">{stats?.projects.active || 0}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Ticket className="w-3.5 h-3.5 text-orange-300" />
                  <span className="text-blue-100 text-xs">Open Tickets</span>
                </div>
                <p className="font-bold text-lg">{stats?.tickets.open || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
