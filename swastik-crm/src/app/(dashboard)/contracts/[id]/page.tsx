'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Edit, Download, CheckCircle, Clock, Send,
  Printer, FileText, MessageSquare, Activity, X, Save
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface Note {
  _id: string;
  description: string;
  addedfrom?: { name: string };
  dateadded: string;
}

interface ActivityLog {
  _id: string;
  description: string;
  date: string;
  staff?: { name: string };
}

interface Contract {
  _id: string;
  subject: string;
  client?: { _id: string; company: string; email: string };
  contract_type?: { name: string };
  start_date: string;
  end_date: string;
  value: number;
  status?: number; // 0=Draft,1=Active,2=Expired,3=Cancelled
  signed: number;
  signed_date?: string;
  description: string;
  content?: string;
  trash: number;
  not_visible_to_client: number;
}

const STATUS_MAP: Record<number, { label: string; cls: string }> = {
  0: { label: 'Draft',      cls: 'bg-gray-100 text-gray-700' },
  1: { label: 'Active',     cls: 'bg-green-100 text-green-700' },
  2: { label: 'Expired',    cls: 'bg-red-100 text-red-700' },
  3: { label: 'Cancelled',  cls: 'bg-yellow-100 text-yellow-700' },
};

export default function ContractDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract]   = useState<Contract | null>(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'activity'>('overview');
  const [notes, setNotes]         = useState<Note[]>([]);
  const [activity, setActivity]   = useState<ActivityLog[]>([]);
  const [noteText, setNoteText]   = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Edit modal state
  const [editOpen, setEditOpen]   = useState(false);
  const [editForm, setEditForm]   = useState<Partial<Contract>>({});
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then(r => r.json())
      .then(d => {
        setContract(d.data);
        setEditForm(d.data || {});
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'notes') {
      fetch(`/api/notes?rel_type=contract&rel_id=${id}`)
        .then(r => r.json()).then(d => setNotes(d.data || []));
    }
    if (activeTab === 'activity') {
      fetch(`/api/activity?rel_type=contract&rel_id=${id}`)
        .then(r => r.json()).then(d => setActivity(d.data || []));
    }
  }, [activeTab, id]);

  const handleSaveEdit = async () => {
    setSaving(true);
    const res = await fetch(`/api/contracts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (data.data) setContract(data.data);
    setSaving(false);
    setEditOpen(false);
  };

  const handleMarkSent = async () => {
    const res = await fetch(`/api/contracts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 1, signed: 1, signed_date: new Date().toISOString() }),
    });
    const data = await res.json();
    if (data.data) setContract(data.data);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rel_type: 'contract', rel_id: id, description: noteText }),
    });
    const data = await res.json();
    if (data.data) setNotes(prev => [data.data, ...prev]);
    setNoteText('');
    setAddingNote(false);
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card"><div className="card-body h-64 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Contract not found.</p>
        <Link href="/contracts" className="btn-primary mt-4 inline-flex items-center gap-2">Back to Contracts</Link>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[contract.status ?? (contract.signed === 1 ? 1 : 0)] || STATUS_MAP[0];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Link href="/contracts" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{contract.subject}</h1>
            <span className={`badge px-3 py-1 text-sm font-medium rounded-full ${statusInfo.cls}`}>
              {statusInfo.label}
            </span>
          </div>
          {contract.client && (
            <p className="text-sm text-gray-500 mt-0.5">{contract.client.company}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {contract.signed !== 1 && (
            <button onClick={handleMarkSent} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" /> Mark as Signed
            </button>
          )}
          <button onClick={() => setEditOpen(true)} className="btn-secondary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {(['overview', 'notes', 'activity'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' && <FileText className="w-4 h-4" />}
            {tab === 'notes' && <MessageSquare className="w-4 h-4" />}
            {tab === 'activity' && <Activity className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Signature Status Banner */}
            <div className={`card border-l-4 ${contract.signed === 1 ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
              <div className="card-body flex items-center gap-4">
                {contract.signed === 1 ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Contract Signed</p>
                      <p className="text-sm text-green-600">
                        {contract.signed_date ? `Signed on ${formatDate(contract.signed_date)}` : 'Signature recorded'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-800">Awaiting Signature</p>
                      <p className="text-sm text-yellow-600">This contract has not been signed yet</p>
                    </div>
                    <button onClick={handleMarkSent} className="ml-auto btn-primary bg-yellow-500 hover:bg-yellow-600 border-yellow-500">
                      Mark as Signed
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Contract Body/Content */}
            {(contract.content || contract.description) && (
              <div className="card">
                <div className="card-header"><h3 className="font-semibold">Contract Content</h3></div>
                <div className="card-body">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: contract.content || contract.description }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Contract Details</h3></div>
              <div className="card-body space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  {contract.client ? (
                    <Link href={`/clients/${contract.client._id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {contract.client.company}
                    </Link>
                  ) : <p className="text-sm font-medium text-gray-400">—</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contract Type</p>
                  <p className="text-sm font-medium">{contract.contract_type?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`badge px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium">{formatDate(contract.start_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expiration Date</p>
                  <p className="text-sm font-medium">{formatDate(contract.end_date)}</p>
                </div>
                {contract.value > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Contract Value</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(contract.value)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Signature</p>
                  {contract.signed === 1 ? (
                    <span className="badge bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-full">Signed</span>
                  ) : (
                    <span className="badge bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded-full">Not Signed</span>
                  )}
                </div>
                {contract.not_visible_to_client === 1 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-orange-600 font-medium">Hidden from client portal</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="max-w-3xl space-y-4">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Add Note</label>
              <textarea
                className="form-input resize-none h-24 mb-3"
                placeholder="Write a note about this contract..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <button
                onClick={handleAddNote}
                disabled={addingNote || !noteText.trim()}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {addingNote ? 'Saving...' : 'Add Note'}
              </button>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No notes yet</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note._id} className="card">
                <div className="card-body">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <span>{note.addedfrom?.name || 'Staff'}</span>
                    <span>·</span>
                    <span>{formatDate(note.dateadded)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="max-w-3xl">
          {activity.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No activity recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map(log => (
                <div key={log._id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <div className="flex-1 card">
                    <div className="card-body py-3">
                      <p className="text-sm text-gray-700">{log.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        {log.staff && <span>{log.staff.name}</span>}
                        {log.staff && <span>·</span>}
                        <span>{formatDate(log.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Contract"
        size="xl"
        footer={
          <>
            <button onClick={() => setEditOpen(false)} className="btn-secondary flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSaveEdit} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">Subject</label>
            <input
              className="form-input"
              value={editForm.subject || ''}
              onChange={e => setEditForm(p => ({ ...p, subject: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Contract Value</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                value={editForm.value || ''}
                onChange={e => setEditForm(p => ({ ...p, value: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editForm.status ?? 0}
                onChange={e => setEditForm(p => ({ ...p, status: parseInt(e.target.value) }))}
              >
                <option value={0}>Draft</option>
                <option value={1}>Active</option>
                <option value={2}>Expired</option>
                <option value={3}>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={editForm.start_date ? editForm.start_date.substring(0, 10) : ''}
                onChange={e => setEditForm(p => ({ ...p, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Expiration Date</label>
              <input
                type="date"
                className="form-input"
                value={editForm.end_date ? editForm.end_date.substring(0, 10) : ''}
                onChange={e => setEditForm(p => ({ ...p, end_date: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Description / Contract Body</label>
            <textarea
              className="form-input resize-none h-40"
              value={editForm.description || ''}
              onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
