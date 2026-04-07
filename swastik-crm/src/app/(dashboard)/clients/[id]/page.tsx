'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Edit, ArrowLeft, Mail, Phone, Globe, MapPin, Building, Plus, MessageSquare, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface Client {
  _id: string;
  company: string;
  vat: string;
  phonenumber: string;
  country: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  website: string;
  active: number;
  contacts?: { _id: string; firstname: string; lastname: string; email: string; phone: string; phonenumber?: string; is_primary: number }[];
  invoices?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  tickets?: Record<string, unknown>[];
  contracts?: Record<string, unknown>[];
}

interface Note {
  _id: string;
  description: string;
  dateadded: string;
  addedfrom?: { firstname: string; lastname: string };
}

const TABS = ['Overview', 'Contacts', 'Invoices', 'Projects', 'Payments', 'Tickets', 'Contracts', 'Notes', 'Statement'];

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [tabData, setTabData] = useState<Record<string, unknown[]>>({});
  const [tabLoading, setTabLoading] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  // Statement state
  const [statement, setStatement] = useState<{ totalInvoiced: number; totalPaid: number; balance: number } | null>(null);

  const fetchClient = () =>
    fetch(`/api/clients/${id}`)
      .then(r => r.json())
      .then(data => setClient(data.data))
      .finally(() => setLoading(false));

  useEffect(() => { fetchClient(); }, [id]);

  const fetchNotes = () => {
    setNotesLoading(true);
    fetch(`/api/notes?rel_id=${id}&rel_type=client`)
      .then(r => r.json())
      .then(d => setNotes(d.data || []))
      .finally(() => setNotesLoading(false));
  };

  const fetchStatement = () => {
    fetch(`/api/invoices?client=${id}`)
      .then(r => r.json())
      .then(d => {
        const invs = (d.data || []) as Record<string, unknown>[];
        const totalInvoiced = invs.reduce((s, inv) => s + ((inv.total as number) || 0), 0);
        const totalPaid = invs
          .filter(inv => inv.status === 2)
          .reduce((s, inv) => s + ((inv.total as number) || 0), 0);
        setStatement({ totalInvoiced, totalPaid, balance: totalInvoiced - totalPaid });
      });
  };

  useEffect(() => {
    if (activeTab === 'Overview' || activeTab === 'Contacts') return;
    if (activeTab === 'Notes') { fetchNotes(); return; }
    if (activeTab === 'Statement') { fetchStatement(); return; }
    setTabLoading(true);
    const endpoints: Record<string, string> = {
      Invoices: `/api/invoices?client=${id}`,
      Payments: `/api/payments?client=${id}`,
      Projects: `/api/projects?client=${id}`,
      Tickets: `/api/tickets?client=${id}`,
      Contracts: `/api/contracts?client=${id}`,
    };
    const url = endpoints[activeTab];
    if (url) {
      fetch(url)
        .then(r => r.json())
        .then(data => setTabData(prev => ({ ...prev, [activeTab]: data.data || [] })))
        .finally(() => setTabLoading(false));
    } else {
      setTabLoading(false);
    }
  }, [activeTab, id]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: noteText, rel_id: id, rel_type: 'client' }),
    });
    setNoteText('');
    setAddingNote(false);
    fetchNotes();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    fetchNotes();
  };

  const handleEditNote = async () => {
    if (!editingNote || !editNoteText.trim()) return;
    await fetch(`/api/notes/${editingNote._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: editNoteText }),
    });
    setEditingNote(null);
    setEditNoteText('');
    fetchNotes();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card"><div className="card-body h-40 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Client not found.</p>
        <Link href="/clients" className="btn-primary mt-4 inline-block">Back to Clients</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/clients" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{client.company}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{client.city}{client.country ? `, ${client.country}` : ''}</p>
        </div>
        <span className={`badge ${getStatusColor(client.active === 1 ? 'active' : 'inactive')}`}>
          {client.active === 1 ? 'Active' : 'Inactive'}
        </span>
        <button
          onClick={() => router.push(`/clients?edit=${id}`)}
          className="btn-secondary flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 -mb-px">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Company Details</h3></div>
              <div className="card-body grid grid-cols-2 gap-5">
                <InfoRow icon={<Building className="w-4 h-4" />} label="Company" value={client.company} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={client.phonenumber} />
                <InfoRow icon={<Globe className="w-4 h-4" />} label="Website" value={client.website} />
                <InfoRow icon={null} label="VAT Number" value={client.vat} />
                <InfoRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={[client.address, client.city, client.state, client.zip, client.country].filter(Boolean).join(', ')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Contacts</h3></div>
              <div className="card-body space-y-4">
                {client.contacts?.length ? client.contacts.map(c => (
                  <div key={c._id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold shrink-0">
                      {c.firstname[0]}{c.lastname[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.firstname} {c.lastname}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-400">No contacts found</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Contacts' && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">All Contacts</h3>
          </div>
          <div className="card-body p-0">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Primary</th></tr>
              </thead>
              <tbody>
                {client.contacts?.length ? client.contacts.map(c => (
                  <tr key={c._id}>
                    <td className="font-medium">{c.firstname} {c.lastname}</td>
                    <td><a href={`mailto:${c.email}`} className="text-blue-600 hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</a></td>
                    <td>{c.phonenumber || c.phone || '—'}</td>
                    <td>{c.is_primary === 1 ? <span className="badge bg-green-100 text-green-800">Primary</span> : '—'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">No contacts found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {['Invoices', 'Projects', 'Tickets', 'Contracts'].includes(activeTab) && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">{activeTab}</h3></div>
          <div className="card-body p-0">
            {tabLoading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded" />)}
              </div>
            ) : (
              <TabTable tab={activeTab} data={(tabData[activeTab] || []) as Record<string, unknown>[]} />
            )}
          </div>
        </div>
      )}

      {activeTab === 'Payments' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Payments</h3></div>
          <div className="card-body p-0">
            {tabLoading ? (
              <div className="p-6 space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded" />)}</div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Date</th><th>Invoice</th><th>Amount</th><th>Mode</th></tr></thead>
                <tbody>
                  {(tabData['Payments'] || []).length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-400">No payments found</td></tr>
                  ) : (tabData['Payments'] as Record<string, unknown>[]).map(p => (
                    <tr key={p._id as string}>
                      <td>{formatDate(p.date as string)}</td>
                      <td>{p.invoiceid ? <Link href={`/invoices/${p.invoiceid}`} className="text-blue-600 hover:underline">{String(p.invoiceid)}</Link> : '—'}</td>
                      <td className="font-medium">{formatCurrency(p.amount as number)}</td>
                      <td>{(p.paymentmode as string) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Notes' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Add Note</h3></div>
            <div className="card-body space-y-3">
              <textarea
                className="form-input w-full"
                rows={3}
                placeholder="Write a note about this client..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteText.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Notes</h3></div>
            <div className="card-body">
              {notesLoading ? (
                <div className="space-y-3 animate-pulse">{[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>
              ) : notes.length === 0 ? (
                <p className="text-center py-8 text-gray-400">No notes yet</p>
              ) : (
                <div className="space-y-4">
                  {notes.map(note => (
                    <div key={note._id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        {editingNote?._id === note._id ? (
                          <div className="space-y-2">
                            <textarea
                              className="form-input w-full"
                              rows={2}
                              value={editNoteText}
                              onChange={e => setEditNoteText(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button onClick={handleEditNote} className="btn-primary text-xs py-1 px-3">Save</button>
                              <button onClick={() => setEditingNote(null)} className="btn-secondary text-xs py-1 px-3">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-800 leading-relaxed">{note.description}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-gray-400">
                                {note.addedfrom ? `${note.addedfrom.firstname} ${note.addedfrom.lastname}` : ''} · {formatDate(note.dateadded)}
                              </p>
                              <button
                                onClick={() => { setEditingNote(note); setEditNoteText(note.description); }}
                                className="text-xs text-blue-500 hover:underline"
                              >Edit</button>
                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="text-xs text-red-500 hover:underline"
                              >Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Statement' && (
        <div className="space-y-6">
          {statement ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card">
                <div className="card-body text-center">
                  <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(statement.totalInvoiced)}</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(statement.totalPaid)}</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body text-center">
                  <DollarSign className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Outstanding Balance</p>
                  <p className={`text-2xl font-bold ${statement.balance > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(statement.balance)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded" />)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
      </div>
    </div>
  );
}

function TabTable({ tab, data }: { tab: string; data: Record<string, unknown>[] }) {
  if (!data.length) return <p className="text-center py-8 text-gray-400">No {tab.toLowerCase()} found</p>;

  if (tab === 'Invoices') return (
    <table className="data-table">
      <thead><tr><th>Invoice #</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>{data.map((inv: Record<string, unknown>) => (
        <tr key={inv._id as string}>
          <td><Link href={`/invoices/${inv._id}`} className="text-blue-600 hover:underline">{inv.prefix as string}-{String(inv.number).padStart(5, '0')}</Link></td>
          <td>{formatCurrency(inv.total as number)}</td>
          <td>{formatDate(inv.date as string)}</td>
          <td><span className={`badge ${getStatusColor(['draft','unpaid','paid','overdue','cancelled'][inv.status as number] || 'draft')}`}>{['Draft','Unpaid','Paid','Overdue','Cancelled'][inv.status as number]}</span></td>
        </tr>
      ))}</tbody>
    </table>
  );

  if (tab === 'Projects') return (
    <table className="data-table">
      <thead><tr><th>Name</th><th>Status</th><th>Progress</th><th>Deadline</th></tr></thead>
      <tbody>{data.map((p: Record<string, unknown>) => (
        <tr key={p._id as string}>
          <td><Link href={`/projects/${p._id}`} className="text-blue-600 hover:underline">{p.name as string}</Link></td>
          <td><span className={`badge ${getStatusColor(p.status as string)}`}>{p.status as string}</span></td>
          <td><div className="w-24 bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${p.progress}%` }} /></div></td>
          <td>{formatDate(p.deadline as string)}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  if (tab === 'Tickets') return (
    <table className="data-table">
      <thead><tr><th>Subject</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>{data.map((t: Record<string, unknown>) => (
        <tr key={t._id as string}>
          <td><Link href={`/tickets/${t._id}`} className="text-blue-600 hover:underline">{t.subject as string}</Link></td>
          <td>{t.priority as string}</td>
          <td><span className={`badge ${getStatusColor(t.status as string)}`}>{t.status as string}</span></td>
          <td>{formatDate(t.date as string)}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  if (tab === 'Contracts') return (
    <table className="data-table">
      <thead><tr><th>Subject</th><th>Start</th><th>End</th><th>Value</th></tr></thead>
      <tbody>{data.map((c: Record<string, unknown>) => (
        <tr key={c._id as string}>
          <td><Link href={`/contracts/${c._id}`} className="text-blue-600 hover:underline">{c.subject as string}</Link></td>
          <td>{formatDate(c.start_date as string)}</td>
          <td>{formatDate(c.end_date as string)}</td>
          <td>{formatCurrency(c.value as number)}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  return null;
}
