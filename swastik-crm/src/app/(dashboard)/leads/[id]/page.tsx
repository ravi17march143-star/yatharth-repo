'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, UserPlus, Mail, Phone, Globe, MessageSquare, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Lead {
  _id: string;
  name: string;
  company: string;
  email: string;
  phonenumber: string;
  website: string;
  address: string;
  city: string;
  country: string;
  status: { _id: string; name: string; color: string };
  source: { _id: string; name: string } | null;
  assigned: { _id: string; firstname: string; lastname: string } | null;
  dateadded: string;
  note: string;
  activity?: { _id: string; description: string; date: string; staff: string }[];
  notes?: { _id: string; content: string; dateadded: string; staff: string }[];
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(data => setLead(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await fetch(`/api/leads/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText }),
    });
    setNoteText('');
    setAddingNote(false);
    fetch(`/api/leads/${id}`).then(r => r.json()).then(d => setLead(d.data));
  };

  const handleConvertToClient = async () => {
    if (!confirm('Convert this lead to a client? This action cannot be undone.')) return;
    setConverting(true);
    const res = await fetch(`/api/leads/${id}/convert`, { method: 'POST' });
    const data = await res.json();
    setConverting(false);
    if (res.ok && data.data?._id) {
      router.push(`/clients/${data.data._id}`);
    } else if (data.message) {
      alert(data.message);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card"><div className="card-body h-40 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Lead not found.</p>
        <Link href="/leads" className="btn-primary mt-4 inline-block">Back to Leads</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/leads" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{lead.company}</p>
        </div>
        {lead.status && (
          <span className="badge text-sm px-3 py-1" style={{ backgroundColor: lead.status.color + '20', color: lead.status.color }}>
            {lead.status.name}
          </span>
        )}
        <button
          onClick={handleConvertToClient}
          disabled={converting}
          className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="w-4 h-4" />
          {converting ? 'Converting...' : 'Convert to Client'}
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 -mb-px">
          {['Overview', 'Notes', 'Activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Contact Information</h3></div>
              <div className="card-body grid grid-cols-2 gap-5">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-sm font-medium text-blue-600 hover:underline">{lead.email || '—'}</a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{lead.phonenumber || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="text-sm font-medium">{lead.website || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium">{[lead.address, lead.city, lead.country].filter(Boolean).join(', ') || '—'}</p>
                </div>
              </div>
            </div>

            {lead.note && (
              <div className="card">
                <div className="card-header"><h3 className="font-semibold">Description</h3></div>
                <div className="card-body">
                  <p className="text-sm text-gray-600 leading-relaxed">{lead.note}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Lead Details</h3></div>
              <div className="card-body space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  {lead.status && (
                    <span className="badge mt-1" style={{ backgroundColor: lead.status.color + '20', color: lead.status.color }}>
                      {lead.status.name}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm font-medium">{lead.source?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium">
                    {lead.assigned ? `${lead.assigned.firstname} ${lead.assigned.lastname}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date Added</p>
                  <p className="text-sm font-medium">{formatDate(lead.dateadded)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Notes' && (
        <div className="space-y-6">
          {/* Add Note */}
          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Add Note</h3></div>
            <div className="card-body space-y-3">
              <textarea
                className="form-input"
                rows={3}
                placeholder="Write a note..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <div className="flex justify-end">
                <button onClick={handleAddNote} disabled={addingNote || !noteText.trim()} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Notes</h3></div>
            <div className="card-body space-y-4">
              {lead.notes?.length ? lead.notes.map(note => (
                <div key={note._id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{note.staff} · {formatDate(note.dateadded)}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-400 py-6">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Activity' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Activity Log</h3></div>
          <div className="card-body">
            {lead.activity?.length ? (
              <div className="space-y-4">
                {lead.activity.map(act => (
                  <div key={act._id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800">{act.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{act.staff} · {formatDate(act.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-6">No activity recorded</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
