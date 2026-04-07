'use client';

import { useState, useEffect } from 'react';
import { Plus, Star, Edit, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

interface Role { _id: string; name: string; isdefault: number; permissions: Record<string, boolean>; }

const PERMISSIONS = ['clients', 'invoices', 'projects', 'tasks', 'leads', 'expenses', 'estimates', 'proposals', 'contracts', 'tickets', 'reports', 'staff'];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', permissions: {} as Record<string, boolean> });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/roles').then(r => r.json()).then(d => { setRoles(d.data || []); setLoading(false); }); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch('/api/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { const d = await res.json(); setRoles([...roles, d.data]); setShowAdd(false); }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Roles & Permissions</h1><p className="page-subtitle">Manage staff access control</p></div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> New Role</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? null : roles.length === 0 ? (
          <EmptyState icon={Star} title="No Roles" description="Create roles to manage staff permissions." />
        ) : roles.map(role => (
          <div key={role._id} className="card card-body">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center"><Star className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  {role.isdefault === 1 && <span className="badge bg-green-100 text-green-700 text-xs">Default</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit className="w-4 h-4" /></button>
                {role.isdefault !== 1 && <button className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(role.permissions || {}).filter(([, v]) => v).map(([k]) => (
                <span key={k} className="badge bg-blue-50 text-blue-700 text-xs capitalize">{k}</span>
              ))}
              {role.isdefault === 1 && <span className="badge bg-purple-50 text-purple-700 text-xs">All Access</span>}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create New Role"
        footer={<><button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Creating...' : 'Create Role'}</button></>}>
        <form className="space-y-4" onSubmit={handleAdd}>
          <div><label className="form-label">Role Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Sales Manager" /></div>
          <div>
            <label className="form-label">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSIONS.map(p => (
                <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={!!form.permissions[p]} onChange={e => setForm({...form, permissions: {...form.permissions, [p]: e.target.checked}})} className="rounded" />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
