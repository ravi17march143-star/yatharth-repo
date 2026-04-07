'use client';

import { useState, useEffect } from 'react';
import { MailOpen, Edit, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  message: string;
  active: number;
  type?: string;
}

const MERGE_TAGS = [
  '{contact_name}', '{company_name}', '{email}', '{phone}',
  '{invoice_number}', '{invoice_amount}', '{invoice_due_date}',
  '{project_name}', '{ticket_subject}', '{staff_name}',
  '{site_name}', '{site_url}', '{password_reset_link}',
];

const emptyForm = { name: '', subject: '', message: '', active: 1 };

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/email-templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.data || []); setLoading(false); });
  }, []);

  const openEdit = (tpl: EmailTemplate) => {
    setEditing(tpl);
    setForm({
      name: tpl.name,
      subject: tpl.subject,
      message: tpl.message,
      active: tpl.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const res = await fetch('/api/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editing._id }),
      });
      if (res.ok) {
        const d = await res.json();
        setTemplates(templates.map(t => t._id === editing._id ? d.data : t));
        setShowModal(false);
      }
    } else {
      const res = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const d = await res.json();
        setTemplates([...templates, d.data]);
        setShowModal(false);
      }
    }
    setSaving(false);
  };

  const toggleActive = async (tpl: EmailTemplate) => {
    const newActive = tpl.active === 1 ? 0 : 1;
    const res = await fetch('/api/email-templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tpl._id, active: newActive }),
    });
    if (res.ok) {
      setTemplates(templates.map(t => t._id === tpl._id ? { ...t, active: newActive } : t));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const insertTag = (tag: string) => {
    setForm(f => ({ ...f, message: f.message + tag }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Email Templates</h1>
          <p className="page-subtitle">{templates.length} templates configured</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setEditing(null); setForm({ ...emptyForm }); setShowModal(true); }}
        >
          <MailOpen className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="card">
        {loading ? (
          <TableSkeleton />
        ) : templates.length === 0 ? (
          <EmptyState
            icon={MailOpen}
            title="No Email Templates"
            description="Create email templates for automated messages."
            action={
              <button className="btn-primary" onClick={() => { setEditing(null); setForm({ ...emptyForm }); setShowModal(true); }}>
                <MailOpen className="w-4 h-4" /> New Template
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {templates.map(tpl => (
              <div key={tpl._id} className="p-4">
                {/* Template Row */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{tpl.name}</span>
                      {tpl.type && (
                        <span className="badge bg-slate-100 text-slate-600 text-xs">{tpl.type}</span>
                      )}
                      <span className={`badge text-xs ${tpl.active === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tpl.active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">Subject: {tpl.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleExpand(tpl._id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title={expandedId === tpl._id ? 'Collapse' : 'Preview'}
                    >
                      {expandedId === tpl._id
                        ? <ChevronUp className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                    <button
                      onClick={() => openEdit(tpl)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(tpl)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        tpl.active === 1
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title="Toggle active"
                    >
                      {tpl.active === 1 ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {/* Expanded Preview */}
                {expandedId === tpl._id && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</span>
                      <p className="text-sm text-gray-800 mt-0.5">{tpl.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</span>
                      <div
                        className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: tpl.message.replace(/\n/g, '<br/>') }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? `Edit: ${editing.name}` : 'New Email Template'}
        size="2xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Template'}
            </button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Template Name *</label>
              <input
                className="form-input"
                required
                placeholder="e.g. Invoice Sent"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={form.active === 1}
                  onChange={e => setForm({ ...form, active: e.target.checked ? 1 : 0 })}
                />
                <span className="font-medium">Active (send this template)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="form-label">Subject *</label>
            <input
              className="form-input"
              required
              placeholder="e.g. Your invoice {invoice_number} is ready"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          {/* Merge Tags */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-700 mb-2">Available Merge Tags — click to insert:</p>
            <div className="flex flex-wrap gap-1.5">
              {MERGE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertTag(tag)}
                  className="text-xs bg-white border border-blue-200 text-blue-700 rounded px-2 py-0.5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-mono"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Message Body *</label>
            <textarea
              className="form-input resize-none h-56 font-mono text-sm"
              required
              placeholder="Dear {contact_name},&#10;&#10;Your invoice {invoice_number} for {invoice_amount} is attached.&#10;&#10;Best regards,&#10;{staff_name}"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">
              Use the merge tags above to personalise each email automatically.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
