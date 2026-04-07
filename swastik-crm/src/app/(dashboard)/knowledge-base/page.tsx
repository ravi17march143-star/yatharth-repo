'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, Eye, Edit, Trash2, X, Loader2, FolderOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface KBGroup { _id: string; name: string; description?: string; }
interface Article {
  _id: string;
  title: string;
  description?: string;
  articlegroup: KBGroup | null;
  active: number;
  visibility?: string;
  views: number;
  thumbs_up: number;
  thumbs_down: number;
  disable_rating?: number;
  dateadded: string;
}

const EMPTY_ARTICLE = {
  title: '', description: '', content: '',
  articlegroup: '', visibility: 'public', disable_rating: false,
};

const EMPTY_GROUP = { name: '', description: '' };

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [groups, setGroups] = useState<KBGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState<typeof EMPTY_ARTICLE>(EMPTY_ARTICLE);
  const [savingArticle, setSavingArticle] = useState(false);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState<typeof EMPTY_GROUP>(EMPTY_GROUP);
  const [savingGroup, setSavingGroup] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/knowledge-base')
      .then(r => r.json())
      .then(d => setArticles(d.data || []))
      .finally(() => setLoading(false));
  };

  const fetchGroups = () => {
    fetch('/api/knowledge-base/groups')
      .then(r => r.json())
      .then(d => setGroups(d.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchArticles();
    fetchGroups();
  }, []);

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchGroup = !selectedGroup || a.articlegroup?._id === selectedGroup;
    return matchSearch && matchGroup;
  });

  const openAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({ ...EMPTY_ARTICLE, articlegroup: selectedGroup });
    setShowArticleModal(true);
  };

  const openEditArticle = (a: Article) => {
    setEditingArticle(a);
    setArticleForm({
      title: a.title,
      description: a.description || '',
      content: '',
      articlegroup: a.articlegroup?._id || '',
      visibility: a.visibility || 'public',
      disable_rating: Boolean(a.disable_rating),
    });
    setShowArticleModal(true);
  };

  const handleSaveArticle = async () => {
    if (!articleForm.title.trim()) return;
    setSavingArticle(true);
    const url = editingArticle ? `/api/knowledge-base/${editingArticle._id}` : '/api/knowledge-base';
    const method = editingArticle ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...articleForm,
        disable_rating: articleForm.disable_rating ? 1 : 0,
      }),
    });
    if (res.ok) {
      setShowArticleModal(false);
      fetchArticles();
    }
    setSavingArticle(false);
  };

  const handleSaveGroup = async () => {
    if (!groupForm.name.trim()) return;
    setSavingGroup(true);
    const res = await fetch('/api/knowledge-base/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupForm),
    });
    if (res.ok) {
      setShowGroupModal(false);
      setGroupForm(EMPTY_GROUP);
      fetchGroups();
    }
    setSavingGroup(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/knowledge-base/${deleteTarget._id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchArticles();
  };

  const visibilityBadge = (v?: string) => {
    if (v === 'private') return 'bg-red-100 text-red-700';
    if (v === 'clients') return 'bg-purple-100 text-purple-700';
    return 'bg-green-100 text-green-700';
  };

  const visibilityLabel = (v?: string) => {
    if (v === 'private') return 'Private';
    if (v === 'clients') return 'Clients';
    return 'Public';
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Left Sidebar: Groups */}
      <div className="w-56 shrink-0">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <span className="font-semibold text-gray-700 text-sm">Groups</span>
            <button
              onClick={() => setShowGroupModal(true)}
              className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100"
              title="Add Group"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => setSelectedGroup('')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                !selectedGroup ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All Articles</span>
              <span className="ml-auto text-xs text-gray-400">{articles.length}</span>
            </button>
            {groups.map(g => {
              const count = articles.filter(a => a.articlegroup?._id === g._id).length;
              return (
                <button
                  key={g._id}
                  onClick={() => setSelectedGroup(g._id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedGroup === g._id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span className="flex-1 text-left truncate">{g.name}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </button>
              );
            })}
            {groups.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No groups yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Knowledge Base</h1>
            <p className="page-subtitle">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={openAddArticle} className="btn-primary">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="font-semibold text-gray-700">
              {selectedGroup ? groups.find(g => g._id === selectedGroup)?.name : 'All Articles'}
            </span>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No articles found</p>
              <p className="text-sm text-gray-400 mt-1">Create your first knowledge base article</p>
              <button onClick={openAddArticle} className="btn-primary mt-4 mx-auto">
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Group</th>
                    <th>Visibility</th>
                    <th>Rating</th>
                    <th>Views</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a._id}>
                      <td>
                        <p className="font-medium text-gray-900">{a.title}</p>
                        {a.description && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{a.description}</p>
                        )}
                      </td>
                      <td className="text-gray-500 text-sm">{a.articlegroup?.name || '—'}</td>
                      <td>
                        <span className={`badge ${visibilityBadge(a.visibility)}`}>
                          {visibilityLabel(a.visibility)}
                        </span>
                      </td>
                      <td>
                        {a.disable_rating ? (
                          <span className="text-xs text-gray-400">Disabled</span>
                        ) : (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-1 text-green-600">
                              <ThumbsUp className="w-3 h-3" /> {a.thumbs_up}
                            </span>
                            <span className="flex items-center gap-1 text-red-400">
                              <ThumbsDown className="w-3 h-3" /> {a.thumbs_down}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="text-gray-500 text-sm">{a.views}</td>
                      <td className="text-gray-400 text-xs">{formatDate(a.dateadded)}</td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditArticle(a)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(a)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">{editingArticle ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setShowArticleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="Article title"
                  value={articleForm.title}
                  onChange={e => setArticleForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Group</label>
                <select
                  className="form-select"
                  value={articleForm.articlegroup}
                  onChange={e => setArticleForm(f => ({ ...f, articlegroup: e.target.value }))}
                >
                  <option value="">No Group</option>
                  {groups.map(g => (
                    <option key={g._id} value={g._id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-input resize-none"
                  rows={2}
                  placeholder="Brief description of the article..."
                  value={articleForm.description}
                  onChange={e => setArticleForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Content</label>
                <textarea
                  className="form-input resize-none"
                  rows={6}
                  placeholder="Article content..."
                  value={articleForm.content}
                  onChange={e => setArticleForm(f => ({ ...f, content: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Visibility</label>
                <select
                  className="form-select"
                  value={articleForm.visibility}
                  onChange={e => setArticleForm(f => ({ ...f, visibility: e.target.value }))}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="clients">Clients Only</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="disable_rating"
                  checked={Boolean(articleForm.disable_rating)}
                  onChange={e => setArticleForm(f => ({ ...f, disable_rating: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="disable_rating" className="text-sm text-gray-700">Disable rating for this article</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowArticleModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSaveArticle} disabled={savingArticle || !articleForm.title.trim()} className="btn-primary">
                {savingArticle ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {savingArticle ? 'Saving...' : editingArticle ? 'Update Article' : 'Create Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">New Group</h2>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Group Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Getting Started"
                  value={groupForm.name}
                  onChange={e => setGroupForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Group description..."
                  value={groupForm.description}
                  onChange={e => setGroupForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowGroupModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSaveGroup} disabled={savingGroup || !groupForm.name.trim()} className="btn-primary">
                {savingGroup ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {savingGroup ? 'Saving...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Article</h2>
            <p className="text-gray-600 mb-6">
              Delete article <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
