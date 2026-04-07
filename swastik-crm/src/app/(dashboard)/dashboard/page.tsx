'use client';

import { useEffect, useState } from 'react';
import {
  Users, FileText, DollarSign, TrendingUp, FolderKanban,
  CheckSquare, UserPlus, Ticket, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  totalOutstanding: number;
  activeProjects: number;
  openTasks: number;
  openLeads: number;
  openTickets: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

interface ChartData {
  revenueExpense: Array<{ month: string; revenue: number; expenses: number }>;
  taskStatus: Array<{ name: string; count: number }>;
  leadStatus: Array<{ name: string; color: string; count: number }>;
}

const TASK_COLORS = ['#6b7280', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<{ _id: string; prefix: string; number: number; client: { company: string }; total: number; status: number; date: string }[]>([]);
  const [recentProjects, setRecentProjects] = useState<{ _id: string; name: string; client: { company: string }; status: number; progress: number; deadline: string }[]>([]);
  const [recentTickets, setRecentTickets] = useState<{ _id: string; ticketid: number; subject: string; client: { company: string }; status: number; priority: number; date: string }[]>([]);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        setStats(data.stats);
        setRecentInvoices(data.recentInvoices || []);
        setRecentProjects(data.recentProjects || []);
        setRecentTickets(data.recentTickets || []);
        setCharts(data.charts || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Clients', value: stats?.totalClients || 0, icon: Users, color: 'bg-blue-500', href: '/clients', change: '+12%', positive: true },
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500', href: '/payments', change: '+8%', positive: true },
    { label: 'Outstanding', value: formatCurrency(stats?.totalOutstanding || 0), icon: TrendingUp, color: 'bg-orange-500', href: '/invoices?status=1', change: '-3%', positive: false },
    { label: 'Active Projects', value: stats?.activeProjects || 0, icon: FolderKanban, color: 'bg-purple-500', href: '/projects', change: '+5', positive: true },
    { label: 'Open Tasks', value: stats?.openTasks || 0, icon: CheckSquare, color: 'bg-cyan-500', href: '/tasks', change: '+2', positive: true },
    { label: 'Open Leads', value: stats?.openLeads || 0, icon: UserPlus, color: 'bg-pink-500', href: '/leads', change: '+7', positive: true },
    { label: 'Total Invoices', value: stats?.totalInvoices || 0, icon: FileText, color: 'bg-indigo-500', href: '/invoices', change: '+4', positive: true },
    { label: 'Open Tickets', value: stats?.openTickets || 0, icon: Ticket, color: 'bg-red-500', href: '/tickets', change: '-2', positive: false },
  ];

  const invoiceStatusMap: Record<number, { label: string; cls: string }> = {
    1: { label: 'Unpaid', cls: 'bg-red-100 text-red-700' },
    2: { label: 'Paid', cls: 'bg-green-100 text-green-700' },
    3: { label: 'Partial', cls: 'bg-yellow-100 text-yellow-700' },
    4: { label: 'Overdue', cls: 'bg-orange-100 text-orange-700' },
    5: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-700' },
    6: { label: 'Draft', cls: 'bg-slate-100 text-slate-700' },
  };

  const projectStatusMap: Record<number, string> = { 1: 'In Progress', 2: 'On Hold', 3: 'Cancelled', 4: 'Finished' };

  const ticketStatusMap: Record<number, { label: string; cls: string }> = {
    1: { label: 'Open', cls: 'bg-blue-100 text-blue-700' },
    2: { label: 'In Progress', cls: 'bg-cyan-100 text-cyan-700' },
    3: { label: 'Answered', cls: 'bg-green-100 text-green-700' },
    4: { label: 'On Hold', cls: 'bg-yellow-100 text-yellow-700' },
    5: { label: 'Closed', cls: 'bg-gray-100 text-gray-700' },
  };

  const ticketPriorityMap: Record<number, { label: string; cls: string }> = {
    1: { label: 'Low', cls: 'text-green-600' },
    2: { label: 'Medium', cls: 'text-yellow-600' },
    3: { label: 'High', cls: 'text-orange-600' },
    4: { label: 'Urgent', cls: 'text-red-600' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 bg-gray-200 rounded w-36 animate-pulse mb-1" />
          <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-7 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your business performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="stat-card group hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`stat-card-icon ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`flex items-center text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
                  {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </span>
              </div>
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
          <p className="text-blue-100 text-sm font-medium mb-1">This Month Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
          <p className="text-blue-200 text-xs mt-2">Payments received this month</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
          <p className="text-green-100 text-sm font-medium mb-1">Net Profit (Est.)</p>
          <p className="text-3xl font-bold">{formatCurrency((stats?.monthlyRevenue || 0) - (stats?.monthlyExpenses || 0))}</p>
          <p className="text-green-200 text-xs mt-2">Revenue minus expenses</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-red-600 to-red-700 text-white border-0">
          <p className="text-red-100 text-sm font-medium mb-1">This Month Expenses</p>
          <p className="text-3xl font-bold">{formatCurrency(stats?.monthlyExpenses || 0)}</p>
          <p className="text-red-200 text-xs mt-2">Total expenses this month</p>
        </div>
      </div>

      {/* Charts Row */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue vs Expenses Chart */}
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h3 className="font-semibold text-gray-800">Revenue vs Expenses (6 Months)</h3>
            </div>
            <div className="card-body">
              {charts.revenueExpense && charts.revenueExpense.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={charts.revenueExpense}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                  No data yet — add some payments and expenses
                </div>
              )}
            </div>
          </div>

          {/* Task Status Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-800">Task Status</h3>
            </div>
            <div className="card-body">
              {charts.taskStatus && charts.taskStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={charts.taskStatus}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, count }) => `${name}: ${count}`}
                      labelLine={false}
                    >
                      {charts.taskStatus.map((_, i) => (
                        <Cell key={i} fill={TASK_COLORS[i % TASK_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                  No tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lead Pipeline */}
      {charts?.leadStatus && charts.leadStatus.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-800">Lead Pipeline</h3>
            <Link href="/leads" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-3 flex-wrap">
              {charts.leadStatus.map((s) => (
                <div key={s.name} className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: s.color + '40', backgroundColor: s.color + '10' }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm font-medium" style={{ color: s.color }}>{s.name}</span>
                  <span className="text-sm font-bold text-gray-800">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Recent Invoices
            </h3>
            <Link href="/invoices" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-hidden">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No invoices yet</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv) => {
                    const statusInfo = invoiceStatusMap[inv.status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-700' };
                    return (
                      <tr key={inv._id}>
                        <td>
                          <Link href={`/invoices/${inv._id}`} className="text-blue-600 hover:underline font-medium">
                            {inv.prefix}-{String(inv.number).padStart(5, '0')}
                          </Link>
                        </td>
                        <td className="text-gray-600">{inv.client?.company}</td>
                        <td className="font-medium">{formatCurrency(inv.total)}</td>
                        <td><span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-600" /> Active Projects
            </h3>
            <Link href="/projects" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-hidden">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No projects yet</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Progress</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((proj) => (
                    <tr key={proj._id}>
                      <td>
                        <Link href={`/projects/${proj._id}`} className="text-blue-600 hover:underline font-medium">
                          {proj.name}
                        </Link>
                      </td>
                      <td className="text-gray-600">{proj.client?.company || '—'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${proj.progress || 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{proj.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="text-gray-500 text-xs">{proj.deadline ? formatDate(proj.deadline) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-red-600" /> Recent Support Tickets
          </h3>
          <Link href="/tickets" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-hidden">
          {recentTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No tickets yet</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Subject</th>
                  <th>Client</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => {
                  const statusInfo = ticketStatusMap[ticket.status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-700' };
                  const priorityInfo = ticketPriorityMap[ticket.priority] || { label: 'Normal', cls: 'text-gray-600' };
                  return (
                    <tr key={ticket._id}>
                      <td>
                        <Link href={`/tickets/${ticket._id}`} className="text-blue-600 hover:underline font-medium">
                          #{ticket.ticketid}
                        </Link>
                      </td>
                      <td className="font-medium text-gray-800 max-w-[200px] truncate">{ticket.subject}</td>
                      <td className="text-gray-600">{ticket.client?.company || '—'}</td>
                      <td className={`text-xs font-semibold ${priorityInfo.cls}`}>{priorityInfo.label}</td>
                      <td><span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span></td>
                      <td className="text-gray-500 text-xs">{ticket.date ? formatDate(ticket.date) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
