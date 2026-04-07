'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Mail, Phone, Building2, Shield, DollarSign,
  Edit, Save, X, Activity, Lock, CheckSquare
} from 'lucide-react';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import { ActiveBadge } from '@/components/ui/StatusBadge';
import { PageLoader } from '@/components/ui/LoadingSpinner';

interface StaffMember {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  isadmin: number;
  active: number;
  hourly_rate: number;
  datejoined: string;
  last_login: string | null;
  role: { _id: string; name: string } | null;
  department: { _id: string; name: string } | null;
  bio?: string;
  facebook?: string;
  linkedin?: string;
  skype?: string;
}

interface Department { _id: string; name: string; }
interface Role { _id: string; name: string; }

interface ActivityItem {
  _id: string;
  description: string;
  type: string;
  date: string;
}

const PERMISSION_GROUPS = [
  {
    group: 'Sales',
    permissions: ['leads', 'proposals', 'estimates'],
  },
  {
    group: 'Finance',
    permissions: ['invoices', 'payments', 'expenses', 'credit_notes'],
  },
  {
    group: 'Clients',
    permissions: ['clients', 'contacts', 'subscriptions'],
  },
  {
    group: 'Work',
    permissions: ['projects', 'tasks', 'contracts', 'milestones'],
  },
  {
    group: 'Support',
    permissions: ['tickets', 'knowledge_base'],
  },
  {
    group: 'Admin',
    permissions: ['staff', 'roles', 'reports', 'settings', 'announcements'],
  },
];

type Tab = 'overview' | 'permissions' | 'activity';

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', phonenumber: '',
    hourly_rate: '', isadmin: 0, active: 1, bio: '',
    department: '', role: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/staff/${id}`)
      .then(r => r.json())
      .then(d => {
        const s = d.data;
        setStaff(s);
        setForm({
          firstname: s.firstname || '',
          lastname: s.lastname || '',
          email: s.email || '',
          phonenumber: s.phonenumber || '',
          hourly_rate: s.hourly_rate?.toString() || '',
          isadmin: s.isadmin || 0,
          active: s.active ?? 1,
          bio: s.bio || '',
          department: s.department?._id || '',
          role: s.role?._id || '',
        });
        if (s.permissions) setPermissions(s.permissions);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/departments?limit=100')
      .then(r => r.json())
      .then(d => setDepartments(d.data || []));

    fetch('/api/roles?limit=100')
      .then(r => r.json())
      .then(d => setRoles(d.data || []));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'activity' && activity.length === 0) {
      setActivityLoading(true);
      fetch(`/api/staff/${id}/activity`)
        .then(r => r.json())
        .then(d => { setActivity(d.data || []); setActivityLoading(false); })
        .catch(() => setActivityLoading(false));
    }
  }, [activeTab, id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const d = await res.json();
      setStaff(d.data);
      setEditing(false);
    }
    setSaving(false);
  };

  const handlePermissionSave = async () => {
    setSaving(true);
    await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions }),
    });
    setSaving(false);
  };

  if (loading) return <PageLoader />;
  if (!staff) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Staff member not found.</p>
      <Link href="/staff" className="btn-primary mt-4 inline-flex">Back to Staff</Link>
    </div>
  );

  const fullName = `${staff.firstname} ${staff.lastname}`;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'permissions', label: 'Permissions', icon: Lock },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div>
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/staff" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="page-title">{fullName}</h1>
          <p className="page-subtitle">{staff.role?.name || (staff.isadmin === 1 ? 'Administrator' : 'Staff Member')}</p>
        </div>
        <ActiveBadge active={staff.active} />
      </div>

      {/* Staff Card */}
      <div className="card card-body mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 text-xl font-bold shrink-0">
            {getInitials(fullName)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
            <p className="text-gray-500 text-sm">{staff.email}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {staff.isadmin === 1 && (
                <span className="badge bg-purple-100 text-purple-700">Admin</span>
              )}
              {staff.role && (
                <span className="badge bg-blue-100 text-blue-700">{staff.role.name}</span>
              )}
              {staff.department && (
                <span className="badge bg-teal-100 text-teal-700">{staff.department.name}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-secondary' : 'btn-primary'}
          >
            {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit className="w-4 h-4" /> Edit</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info Card */}
          <div className="card card-body space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Personal Information
            </h3>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phonenumber} onChange={e => setForm({ ...form, phonenumber: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    <option value="">No Department</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Role</label>
                  <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="">No Role</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Hourly Rate (₹)</label>
                  <input type="number" className="form-input" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Bio</label>
                  <textarea className="form-input h-20 resize-none" placeholder="Brief bio or description..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" checked={form.isadmin === 1} onChange={e => setForm({ ...form, isadmin: e.target.checked ? 1 : 0 })} />
                    <span>Administrator</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" checked={form.active === 1} onChange={e => setForm({ ...form, active: e.target.checked ? 1 : 0 })} />
                    <span>Active</span>
                  </label>
                </div>
                <button className="btn-primary w-full" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <dl className="space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: staff.email },
                  { icon: Phone, label: 'Phone', value: staff.phonenumber || '—' },
                  { icon: Building2, label: 'Department', value: staff.department?.name || '—' },
                  { icon: Shield, label: 'Role', value: staff.role?.name || (staff.isadmin === 1 ? 'Administrator' : '—') },
                  { icon: DollarSign, label: 'Hourly Rate', value: staff.hourly_rate ? formatCurrency(staff.hourly_rate) : '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-gray-400 font-medium">{label}</dt>
                      <dd className="text-sm text-gray-800">{value}</dd>
                    </div>
                  </div>
                ))}
                {staff.bio && (
                  <div className="pt-2 border-t border-gray-100">
                    <dt className="text-xs text-gray-400 font-medium mb-1">Bio</dt>
                    <dd className="text-sm text-gray-700 leading-relaxed">{staff.bio}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* Stats Card */}
          <div className="space-y-4">
            <div className="card card-body">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Account Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Date Joined</dt>
                  <dd className="text-sm font-medium text-gray-800">{formatDate(staff.datejoined)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Last Login</dt>
                  <dd className="text-sm font-medium text-gray-800">{staff.last_login ? formatDate(staff.last_login) : 'Never'}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Account Status</dt>
                  <dd><ActiveBadge active={staff.active} /></dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Admin Access</dt>
                  <dd>
                    {staff.isadmin === 1
                      ? <span className="badge bg-purple-100 text-purple-700">Yes</span>
                      : <span className="text-sm text-gray-500">No</span>
                    }
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div>
          {staff.isadmin === 1 ? (
            <div className="card card-body text-center py-8">
              <Shield className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Administrator Account</h3>
              <p className="text-gray-500 text-sm mt-1">This staff member has full access to all features.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {PERMISSION_GROUPS.map(group => (
                <div key={group.group} className="card card-body">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-blue-600" /> {group.group}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {group.permissions.map(perm => (
                      <label key={perm} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={!!permissions[perm]}
                          onChange={e => setPermissions({ ...permissions, [perm]: e.target.checked })}
                        />
                        <span className="capitalize">{perm.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button className="btn-primary" onClick={handlePermissionSave} disabled={saving}>
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          {activityLoading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Loading activity...</div>
          ) : activity.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No activity recorded yet</p>
              <p className="text-gray-400 text-sm mt-1">Activity will appear here as {staff.firstname} uses the system.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activity.map(item => (
                <div key={item._id} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.date)}</p>
                  </div>
                  {item.type && (
                    <span className="badge bg-gray-100 text-gray-600 text-xs shrink-0 capitalize">{item.type}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
