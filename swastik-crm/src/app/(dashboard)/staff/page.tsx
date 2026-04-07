'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import { ActiveBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

interface StaffMember { _id: string; firstname: string; lastname: string; email: string; phonenumber: string; isadmin: number; active: number; role: { name: string } | null; last_login: string | null; datejoined: string; }

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [roles, setRoles] = useState<{_id:string;name:string}[]>([]);
  const [departments, setDepartments] = useState<{_id:string;name:string}[]>([]);
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', phonenumber: '', role: '', department: '', hourly_rate: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/staff').then(r => r.json()).then(d => { setStaff(d.data || []); setLoading(false); });
    fetch('/api/roles').then(r => r.json()).then(d => setRoles(d.data || []));
    fetch('/api/departments').then(r => r.json()).then(d => setDepartments(d.data || []));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { const d = await res.json(); setStaff([d.data, ...staff]); setShowAdd(false); }
    setSaving(false);
  };

  const filtered = staff.filter(s => `${s.firstname} ${s.lastname} ${s.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Staff Members</h1><p className="page-subtitle">{staff.length} staff members</p></div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Staff</button>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="form-input pl-9 w-64" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? <TableSkeleton /> : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No Staff" description="Add your first staff member." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">{getInitials(`${s.firstname} ${s.lastname}`)}</div>
                      <div>
                        <Link href={`/staff/${s._id}`} className="font-medium text-gray-900 hover:text-blue-600">{s.firstname} {s.lastname}</Link>
                        {s.isadmin === 1 && <span className="ml-2 badge bg-purple-100 text-purple-700 text-xs">Admin</span>}
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-500 text-sm">{s.email}</td>
                  <td className="text-gray-500">{s.role?.name || (s.isadmin === 1 ? 'Administrator' : '—')}</td>
                  <td><ActiveBadge active={s.active} /></td>
                  <td className="text-gray-400 text-xs">{s.last_login ? formatDate(s.last_login) : 'Never'}</td>
                  <td className="text-gray-400 text-xs">{formatDate(s.datejoined)}</td>
                  <td>
                    <div className="flex gap-1">
                      <Link href={`/staff/${s._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></Link>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                      {s.isadmin !== 1 && <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Staff Member" size="lg"
        footer={<><button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Adding...' : 'Add Staff'}</button></>}>
        <form className="space-y-4" onSubmit={handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">First Name *</label><input className="form-input" required value={form.firstname} onChange={e => setForm({...form, firstname: e.target.value})} /></div>
            <div><label className="form-label">Last Name *</label><input className="form-input" required value={form.lastname} onChange={e => setForm({...form, lastname: e.target.value})} /></div>
            <div><label className="form-label">Email *</label><input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><label className="form-label">Password *</label><input type="password" className="form-input" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
            <div><label className="form-label">Phone</label><input className="form-input" value={form.phonenumber} onChange={e => setForm({...form, phonenumber: e.target.value})} /></div>
            <div><label className="form-label">Hourly Rate (₹)</label><input type="number" className="form-input" value={form.hourly_rate} onChange={e => setForm({...form, hourly_rate: e.target.value})} /></div>
            <div><label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="">No Role</option>
                {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div><label className="form-label">Department</label>
              <select className="form-select" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                <option value="">No Department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
