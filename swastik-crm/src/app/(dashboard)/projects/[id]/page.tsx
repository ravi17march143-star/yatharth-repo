'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Plus, Flag, MessageSquare } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

interface Project {
  _id: string;
  name: string;
  description: string;
  client?: { _id: string; company: string };
  status: string;
  progress: number;
  start_date: string;
  deadline: string;
  members?: { _id: string; name: string; email: string; role: string }[];
  budget?: number;
}

interface Note {
  _id: string;
  description: string;
  dateadded: string;
  addedfrom?: { firstname: string; lastname: string };
}

const TABS = ['Overview', 'Tasks', 'Milestones', 'Team', 'Notes', 'Files', 'Activity'];

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'On Hold': 'bg-yellow-100 text-yellow-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Finished': 'bg-green-100 text-green-800',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [tasks, setTasks] = useState<Record<string, unknown>[]>([]);
  const [milestones, setMilestones] = useState<Record<string, unknown>[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(data => setProject(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchNotes = () => {
    setNotesLoading(true);
    fetch(`/api/notes?rel_id=${id}&rel_type=project`)
      .then(r => r.json())
      .then(d => setNotes(d.data || []))
      .finally(() => setNotesLoading(false));
  };

  useEffect(() => {
    if (!['Tasks', 'Milestones', 'Notes'].includes(activeTab)) return;
    if (activeTab === 'Notes') { fetchNotes(); return; }
    setTabLoading(true);
    const url = activeTab === 'Tasks' ? `/api/tasks?project=${id}` : `/api/projects/${id}/milestones`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (activeTab === 'Tasks') setTasks(data.data || []);
        else setMilestones(data.data || []);
      })
      .finally(() => setTabLoading(false));
  }, [activeTab, id]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: noteText, rel_id: id, rel_type: 'project' }),
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

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Project not found.</p>
        <Link href="/projects" className="btn-primary mt-4 inline-block">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/projects" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.client && (
            <Link href={`/clients/${project.client._id}`} className="text-sm text-blue-600 hover:underline mt-0.5 inline-block">
              {project.client.company}
            </Link>
          )}
        </div>
        <span className={`badge text-sm px-3 py-1 ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
          {project.status}
        </span>
        <button className="btn-secondary flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-lg font-bold text-gray-800">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium">{formatDate(project.start_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-sm font-medium">{formatDate(project.deadline)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Team Members</p>
              <p className="text-sm font-medium">{project.members?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 -mb-px">
          {TABS.map(tab => (
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

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Description</h3></div>
              <div className="card-body">
                <p className="text-gray-600 text-sm leading-relaxed">{project.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card">
              <div className="card-header"><h3 className="font-semibold">Project Info</h3></div>
              <div className="card-body space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium">{project.client?.company || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`badge ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>{project.status}</span>
                </div>
                {project.budget && (
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-medium">₹{project.budget.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold">Team</h3>
              </div>
              <div className="card-body space-y-3">
                {project.members?.slice(0, 5).map(m => (
                  <div key={m._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                      {m.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.role}</p>
                    </div>
                  </div>
                ))}
                {!project.members?.length && <p className="text-sm text-gray-400">No team members</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Tasks' && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Tasks</h3>
            <Link href={`/tasks?project=${id}`} className="btn-secondary text-sm py-1 px-3">View All</Link>
          </div>
          <div className="card-body p-0">
            {tabLoading ? (
              <div className="p-6 space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded" />)}</div>
            ) : tasks.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No tasks found</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>Task</th><th>Assigned To</th><th>Priority</th><th>Status</th><th>Due Date</th></tr></thead>
                <tbody>
                  {tasks.map((t: Record<string, unknown>) => (
                    <tr key={t._id as string}>
                      <td className="font-medium">{t.name as string}</td>
                      <td>{(t.assigned_to as { name: string } | undefined)?.name || '—'}</td>
                      <td><span className={`badge ${getStatusColor(t.priority as string)}`}>{t.priority as string}</span></td>
                      <td><span className={`badge ${getStatusColor(t.status as string)}`}>{t.status as string}</span></td>
                      <td>{formatDate(t.due_date as string)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Milestones' && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Milestones</h3>
            <button className="btn-primary text-sm py-1 px-3 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="card-body">
            {tabLoading ? (
              <div className="space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded" />)}</div>
            ) : milestones.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No milestones yet</p>
            ) : (
              <div className="space-y-3">
                {milestones.map((m: Record<string, unknown>) => (
                  <div key={m._id as string} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Flag className={`w-5 h-5 ${m.completed ? 'text-green-500' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-medium">{m.name as string}</p>
                      <p className="text-sm text-gray-500">Due: {formatDate(m.due_date as string)}</p>
                    </div>
                    <span className={`badge ${m.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {m.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Team' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Team Members</h3></div>
          <div className="card-body">
            {project.members?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.members.map(m => (
                  <div key={m._id} className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                      {m.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-gray-500">{m.email}</p>
                      <p className="text-xs text-gray-400">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400">No team members assigned</p>
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
                placeholder="Write a note about this project..."
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

      {activeTab === 'Files' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Files</h3></div>
          <div className="card-body">
            <p className="text-center py-8 text-gray-400">No files uploaded</p>
          </div>
        </div>
      )}

      {activeTab === 'Activity' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">Activity Log</h3></div>
          <div className="card-body">
            <p className="text-center py-8 text-gray-400">No activity recorded</p>
          </div>
        </div>
      )}
    </div>
  );
}
