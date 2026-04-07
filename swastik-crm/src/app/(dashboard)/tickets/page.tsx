'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Ticket, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

interface TicketItem {
  _id: string;
  ticketkey: string;
  subject: string;
  userid: { _id: string; company: string } | null;
  department: { _id: string; name: string } | null;
  priority: { _id: string; name: string; color: string } | null;
  status: { _id: string; name: string; color: string } | null;
  assigned: { _id: string; firstname: string; lastname: string } | null;
  date: string;
  service: string;
}

interface Client { _id: string; company: string; }
interface Department { _id: string; name: string; }
interface Priority { _id: string; name: string; color: string; }
interface Status { _id: string; name: string; color: string; }

const EMPTY_FORM = {
  subject: '',
  userid: '',
  department: '',
  priority: '',
  status: '',
  message: '',
  service: '',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [counts, setCounts] = useState({ total: 0, open: 0, inprogress: 0, closed: 0 });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  const fetchTickets = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    if (priorityFilter) params.set('priority', priorityFilter);
    if (search) params.set('search', search);
    fetch(`/api/tickets?${params}`)
      .then(r => r.json())
      .then(d => {
        setTickets(d.data || []);
        setTotalPages(d.pagination?.pages || 1);
        setTotal(d.pagination?.total || 0);
      })
      .finally(() => setLoading(false));
  };

  const fetchCounts = () => {
    Promise.all([
      fetch('/api/tickets?limit=1').then(r => r.json()),
    ]).then(([all]) => {
      const allTotal = all.pagination?.total || 0;
      setCounts(prev => ({ ...prev, total: allTotal }));
    });
  };

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d.data || []));
    fetch('/api/departments').then(r => r.json()).then(d => setDepartments(d.data || []));
    fetch('/api/tickets/priorities').then(r => r.json()).then(d => setPriorities(d.data || []));
    fetch('/api/tickets/statuses').then(r => r.json()).then(d => setStatuses(d.data || []));
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter, priorityFilter, search]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handlePriorityFilter = (val: string) => {
    setPriorityFilter(val);
    setPage(1);
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.subject.trim()) { setFormError('Subject is required.'); return; }
    if (!form.message.trim()) { setFormError('Message is required.'); return; }
    setFormError('');
    setSaving(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || 'Failed to create ticket.');
        return;
      }
      setShowModal(false);
      fetchTickets();
      fetchCounts();
    } finally {
      setSaving(false);
    }
  };

  const openCount = statuses.find(s => s.name.toLowerCase() === 'open')
    ? tickets.filter(t => t.status?.name.toLowerCase() === 'open').length
    : 0;
  const inProgressCount = statuses.find(s => s.name.toLowerCase().includes('progress'))
    ? tickets.filter(t => t.status?.name.toLowerCase().includes('progress')).length
    : 0;
  const closedCount = statuses.find(s => s.name.toLowerCase() === 'closed')
    ? tickets.filter(t => t.status?.name.toLowerCase() === 'closed').length
    : 0;

  const summaryCards = [
    { label: 'Total', value: total, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Open', value: openCount, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'In Progress', value: inProgressCount, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Closed', value: closedCount, color: 'text-green-700', bg: 'bg-green-50' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="page-subtitle">{total} total tickets</p>
        </div>
        <button onClick={openModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(card => (
          <div key={card.label} className={`card p-4 ${card.bg}`}>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="form-input pl-10"
                placeholder="Search tickets..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => handleStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={e => handlePriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              {priorities.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="font-semibold text-gray-700">{total} Ticket{total !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : tickets.length === 0 ? (
          <EmptyState icon={Ticket} title="No Tickets" description="No support tickets found." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Client</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t._id}>
                      <td className="font-mono text-xs text-gray-500">{t.ticketkey}</td>
                      <td>
                        <Link href={`/tickets/${t._id}`} className="font-medium text-blue-600 hover:underline">
                          {t.subject}
                        </Link>
                      </td>
                      <td className="text-gray-600">{t.userid?.company || '—'}</td>
                      <td className="text-gray-500 text-sm">{t.department?.name || '—'}</td>
                      <td>
                        {t.priority ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: t.priority.color + '20', color: t.priority.color }}
                          >
                            {t.priority.name}
                          </span>
                        ) : '—'}
                      </td>
                      <td>
                        {t.status ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: t.status.color + '20', color: t.status.color }}
                          >
                            {t.status.name}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="text-gray-500 text-sm">
                        {t.assigned ? `${t.assigned.firstname} ${t.assigned.lastname}` : '—'}
                      </td>
                      <td className="text-gray-400 text-xs">{formatDate(t.date)}</td>
                      <td>
                        <Link
                          href={`/tickets/${t._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded inline-flex"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
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

      {/* New Ticket Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Ticket"
        size="xl"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create Ticket'}
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
            <label className="form-label">Subject <span className="text-red-500">*</span></label>
            <input
              className="form-input"
              placeholder="Ticket subject"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Client</label>
              <select
                className="form-select"
                value={form.userid}
                onChange={e => setForm(f => ({ ...f, userid: e.target.value }))}
              >
                <option value="">Select Client</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.company}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                <option value="">Select Priority</option>
                {priorities.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="">Select Status</option>
                {statuses.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Service</label>
            <input
              className="form-input"
              placeholder="Service (optional)"
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            />
          </div>

          <div>
            <label className="form-label">Message <span className="text-red-500">*</span></label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Describe the issue..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
