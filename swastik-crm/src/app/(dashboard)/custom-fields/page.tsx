'use client';

import { useState, useEffect } from 'react';
import { Plus, Sliders, Edit, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';

interface CustomField {
  _id: string;
  name: string;
  type: string;
  fieldto: string;
  required: number;
  options: string;
  field_order: number;
}

const FIELD_TYPES = ['text', 'textarea', 'number', 'date', 'checkbox', 'dropdown', 'file'];
const FIELD_TO_OPTIONS = ['Clients', 'Contacts', 'Invoices', 'Leads', 'Expenses', 'Contracts', 'Projects', 'Tickets'];

const emptyForm = {
  name: '',
  type: 'text',
  fieldto: 'Clients',
  required: 0,
  options: '',
  field_order: 0,
};

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTo, setFilterTo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CustomField | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/custom-fields')
      .then(r => r.json())
      .then(d => { setFields(d.data || []); setLoading(false); });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (field: CustomField) => {
    setEditing(field);
    setForm({
      name: field.name,
      type: field.type,
      fieldto: field.fieldto,
      required: field.required,
      options: field.options || '',
      field_order: field.field_order || 0,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const res = await fetch(`/api/custom-fields`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editing._id }),
      });
      if (res.ok) {
        const d = await res.json();
        setFields(fields.map(f => f._id === editing._id ? d.data : f));
        setShowModal(false);
      }
    } else {
      const res = await fetch('/api/custom-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const d = await res.json();
        setFields([...fields, d.data]);
        setShowModal(false);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this custom field? This may remove associated data.')) return;
    setDeletingId(id);
    const res = await fetch(`/api/custom-fields?id=${id}`, { method: 'DELETE' });
    if (res.ok) setFields(fields.filter(f => f._id !== id));
    setDeletingId(null);
  };

  const filtered = filterTo ? fields.filter(f => f.fieldto === filterTo) : fields;

  const typeColor: Record<string, string> = {
    text: 'bg-blue-50 text-blue-700',
    textarea: 'bg-indigo-50 text-indigo-700',
    number: 'bg-green-50 text-green-700',
    date: 'bg-orange-50 text-orange-700',
    checkbox: 'bg-purple-50 text-purple-700',
    dropdown: 'bg-teal-50 text-teal-700',
    file: 'bg-pink-50 text-pink-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Custom Fields</h1>
          <p className="page-subtitle">{fields.length} custom fields configured</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Custom Field
        </button>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-3">
          <label className="form-label mb-0 whitespace-nowrap">Filter by:</label>
          <select
            className="form-select w-48"
            value={filterTo}
            onChange={e => setFilterTo(e.target.value)}
          >
            <option value="">All Modules</option>
            {FIELD_TO_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {filterTo && (
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setFilterTo('')}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Sliders}
            title="No Custom Fields"
            description={filterTo ? `No custom fields for ${filterTo}.` : 'Create your first custom field.'}
            action={
              <button className="btn-primary" onClick={openAdd}>
                <Plus className="w-4 h-4" /> Add Custom Field
              </button>
            }
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Type</th>
                <th>Applies To</th>
                <th>Required</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(field => (
                <tr key={field._id}>
                  <td className="font-medium text-gray-900">{field.name}</td>
                  <td>
                    <span className={`badge capitalize ${typeColor[field.type] || 'bg-gray-100 text-gray-700'}`}>
                      {field.type}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-slate-100 text-slate-700">{field.fieldto}</span>
                  </td>
                  <td>
                    {field.required === 1 ? (
                      <span className="badge bg-red-100 text-red-700">Required</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Optional</span>
                    )}
                  </td>
                  <td className="text-gray-500 text-sm">{field.field_order ?? '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(field)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(field._id)}
                        disabled={deletingId === field._id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Custom Field' : 'Add Custom Field'}
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Field'}
            </button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="form-label">Field Name *</label>
            <input
              className="form-input"
              required
              placeholder="e.g. Tax ID Number"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Field Type *</label>
              <select
                className="form-select"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                {FIELD_TYPES.map(t => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Applies To *</label>
              <select
                className="form-select"
                value={form.fieldto}
                onChange={e => setForm({ ...form, fieldto: e.target.value })}
              >
                {FIELD_TO_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {form.type === 'dropdown' && (
            <div>
              <label className="form-label">Dropdown Options</label>
              <textarea
                className="form-input resize-none h-24"
                placeholder="Enter each option on a new line&#10;Option 1&#10;Option 2&#10;Option 3"
                value={form.options}
                onChange={e => setForm({ ...form, options: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Enter one option per line.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-input"
                min={0}
                value={form.field_order}
                onChange={e => setForm({ ...form, field_order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={form.required === 1}
                  onChange={e => setForm({ ...form, required: e.target.checked ? 1 : 0 })}
                />
                <span className="font-medium">Required field</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
