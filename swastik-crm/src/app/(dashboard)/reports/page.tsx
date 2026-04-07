'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart3, Download, TrendingUp, DollarSign, Users, Ticket, FileText, FolderKanban } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ReportData {
  income?: { total: number; count: number; byMonth?: Array<{ month: string; total: number; count: number }> };
  expense?: { total: number; count: number; byCategory?: Array<{ name: string; total: number; count: number }> };
  leads?: { total: number; converted: number; lost: number; byStatus?: Array<{ name: string; count: number; color: string }> };
  tickets?: { total: number; open: number; closed: number; byStatus?: Array<{ name: string; count: number; color: string }> };
  projects?: { total: number; active: number; completed: number };
  invoices?: { total: number; paid: number; unpaid: number; overdue: number; revenue: number };
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData>({});
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('income');
  const [period, setPeriod] = useState('this_year');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports?type=${reportType}&period=${period}`)
      .then(r => r.json())
      .then(d => setData(d.data || {}))
      .finally(() => setLoading(false));
  }, [reportType, period]);

  const tabs = [
    { key: 'income', label: 'Income', icon: DollarSign, color: 'text-green-600' },
    { key: 'expense', label: 'Expenses', icon: TrendingUp, color: 'text-red-600' },
    { key: 'leads', label: 'Leads', icon: Users, color: 'text-blue-600' },
    { key: 'tickets', label: 'Tickets', icon: Ticket, color: 'text-purple-600' },
    { key: 'invoices', label: 'Invoices', icon: FileText, color: 'text-orange-600' },
    { key: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-cyan-600' },
  ];

  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } catch {
      return monthStr;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Business performance insights</p>
        </div>
        <div className="flex gap-3">
          <select className="form-select w-44" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
            <option value="last_year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn-secondary">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setReportType(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                reportType === t.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${reportType === t.key ? 'text-white' : t.color}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-7 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* === INCOME REPORT === */}
          {reportType === 'income' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat-card">
                  <div className="stat-card-icon bg-green-500"><DollarSign className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{formatCurrency(data.income?.total || 0)}</div>
                  <div className="stat-card-label">Total Income</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-blue-500"><BarChart3 className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.income?.count || 0}</div>
                  <div className="stat-card-label">Payments Received</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-purple-500"><TrendingUp className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">
                    {formatCurrency(data.income?.count ? (data.income.total / data.income.count) : 0)}
                  </div>
                  <div className="stat-card-label">Average Payment</div>
                </div>
              </div>

              {data.income?.byMonth && data.income.byMonth.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="font-semibold text-gray-800">Monthly Income Trend</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.income.byMonth.map(m => ({ ...m, month: formatMonth(m.month) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v: number) => [formatCurrency(v), 'Income']} />
                        <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {data.income?.byMonth && data.income.byMonth.length > 0 && (
                <div className="card">
                  <div className="card-header"><h3 className="font-semibold text-gray-800">Monthly Breakdown</h3></div>
                  <table className="data-table">
                    <thead><tr><th>Month</th><th>Income</th><th>Payments</th><th>Average</th></tr></thead>
                    <tbody>
                      {data.income.byMonth.map((m, i) => (
                        <tr key={i}>
                          <td className="text-gray-700">{formatMonth(m.month)}</td>
                          <td className="font-semibold text-green-700">{formatCurrency(m.total)}</td>
                          <td>{m.count}</td>
                          <td>{formatCurrency(m.count ? m.total / m.count : 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* === EXPENSE REPORT === */}
          {reportType === 'expense' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="stat-card">
                  <div className="stat-card-icon bg-red-500"><DollarSign className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{formatCurrency(data.expense?.total || 0)}</div>
                  <div className="stat-card-label">Total Expenses</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-orange-500"><BarChart3 className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.expense?.count || 0}</div>
                  <div className="stat-card-label">Total Transactions</div>
                </div>
              </div>

              {data.expense?.byCategory && data.expense.byCategory.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <div className="card-header"><h3 className="font-semibold text-gray-800">By Category (Bar)</h3></div>
                    <div className="card-body">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data.expense.byCategory} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v: number) => [formatCurrency(v), 'Amount']} />
                          <Bar dataKey="total" fill="#ef4444" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header"><h3 className="font-semibold text-gray-800">By Category (Pie)</h3></div>
                    <div className="card-body">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={data.expense.byCategory} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {data.expense.byCategory.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === LEADS REPORT === */}
          {reportType === 'leads' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat-card">
                  <div className="stat-card-icon bg-blue-500"><Users className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.leads?.total || 0}</div>
                  <div className="stat-card-label">Total Leads</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-green-500"><TrendingUp className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.leads?.converted || 0}</div>
                  <div className="stat-card-label">Converted to Client</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-red-500"><TrendingUp className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.leads?.lost || 0}</div>
                  <div className="stat-card-label">Lost</div>
                </div>
              </div>

              {data.leads?.total ? (
                <div className="card">
                  <div className="card-header"><h3 className="font-semibold">Conversion Rate</h3></div>
                  <div className="card-body">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {data.leads.total ? Math.round((data.leads.converted / data.leads.total) * 100) : 0}%
                      </span>
                      <span className="text-gray-500">conversion rate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${data.leads.total ? (data.leads.converted / data.leads.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {data.leads?.byStatus && data.leads.byStatus.length > 0 && (
                <div className="card">
                  <div className="card-header"><h3 className="font-semibold">By Status</h3></div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={data.leads.byStatus}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {data.leads.byStatus.map((entry, i) => (
                            <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === TICKETS REPORT === */}
          {reportType === 'tickets' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat-card">
                  <div className="stat-card-icon bg-blue-500"><Ticket className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.tickets?.total || 0}</div>
                  <div className="stat-card-label">Total Tickets</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-orange-500"><Ticket className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.tickets?.open || 0}</div>
                  <div className="stat-card-label">Open Tickets</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-green-500"><Ticket className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.tickets?.closed || 0}</div>
                  <div className="stat-card-label">Closed Tickets</div>
                </div>
              </div>

              {data.tickets?.byStatus && data.tickets.byStatus.length > 0 && (
                <div className="card">
                  <div className="card-header"><h3 className="font-semibold">By Status</h3></div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={data.tickets.byStatus} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, count }) => `${name}: ${count}`}>
                          {data.tickets.byStatus.map((entry, i) => (
                            <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === INVOICES REPORT === */}
          {reportType === 'invoices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat-card">
                  <div className="stat-card-icon bg-blue-500"><FileText className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.invoices?.total || 0}</div>
                  <div className="stat-card-label">Total Invoices</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-green-500"><DollarSign className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{formatCurrency(data.invoices?.revenue || 0)}</div>
                  <div className="stat-card-label">Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-orange-500"><FileText className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.invoices?.unpaid || 0}</div>
                  <div className="stat-card-label">Unpaid</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-red-500"><FileText className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.invoices?.overdue || 0}</div>
                  <div className="stat-card-label">Overdue</div>
                </div>
              </div>

              {(data.invoices?.total || 0) > 0 && (
                <div className="card">
                  <div className="card-header"><h3 className="font-semibold">Invoice Status Distribution</h3></div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={[
                        { name: 'Paid', count: data.invoices?.paid || 0, fill: '#10b981' },
                        { name: 'Unpaid', count: data.invoices?.unpaid || 0, fill: '#f59e0b' },
                        { name: 'Overdue', count: data.invoices?.overdue || 0, fill: '#ef4444' },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {[{ fill: '#10b981' }, { fill: '#f59e0b' }, { fill: '#ef4444' }].map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === PROJECTS REPORT === */}
          {reportType === 'projects' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat-card">
                  <div className="stat-card-icon bg-cyan-500"><FolderKanban className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.projects?.total || 0}</div>
                  <div className="stat-card-label">Total Projects</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-blue-500"><FolderKanban className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.projects?.active || 0}</div>
                  <div className="stat-card-label">Active</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon bg-green-500"><FolderKanban className="w-6 h-6 text-white" /></div>
                  <div className="stat-card-value">{data.projects?.completed || 0}</div>
                  <div className="stat-card-label">Completed</div>
                </div>
              </div>

              {(data.projects?.total || 0) > 0 && (
                <div className="card">
                  <div className="card-header"><h3 className="font-semibold">Project Status Overview</h3></div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Active', value: data.projects?.active || 0 },
                            { name: 'Completed', value: data.projects?.completed || 0 },
                            { name: 'Other', value: Math.max(0, (data.projects?.total || 0) - (data.projects?.active || 0) - (data.projects?.completed || 0)) },
                          ].filter(d => d.value > 0)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {['#3b82f6', '#10b981', '#f59e0b'].map((color, i) => (
                            <Cell key={i} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
