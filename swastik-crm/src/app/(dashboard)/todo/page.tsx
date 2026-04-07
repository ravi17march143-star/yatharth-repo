'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, CheckSquare, Square, Target, X, Loader2,
  Flag, TrendingUp, TrendingDown, Users, DollarSign, Star,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface Goal {
  id: string;
  name: string;
  goal_type: string;
  start_date: string;
  end_date: string;
  target_value: number;
  current_value: number;
  status: 'active' | 'completed' | 'failed';
}

type TodoFilter = 'all' | 'active' | 'completed';
type PriorityType = 'low' | 'medium' | 'high';

const PRIORITY_CONFIG: Record<PriorityType, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', cls: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', cls: 'bg-red-100 text-red-700' },
};

const GOAL_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  income: { label: 'Income', icon: DollarSign, color: 'text-green-600' },
  expenses: { label: 'Expenses', icon: TrendingDown, color: 'text-red-500' },
  leads: { label: 'Leads', icon: Users, color: 'text-blue-600' },
  conversions: { label: 'Conversions', icon: TrendingUp, color: 'text-purple-600' },
  tasks: { label: 'Tasks', icon: CheckSquare, color: 'text-orange-500' },
  other: { label: 'Other', icon: Star, color: 'text-yellow-500' },
};

const STORAGE_KEY_TODOS = 'crm_todos';
const STORAGE_KEY_GOALS = 'crm_goals';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const EMPTY_GOAL_FORM = {
  name: '', goal_type: 'income', start_date: '', end_date: '',
  target_value: '', current_value: '',
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>('all');
  const [newTodoText, setNewTodoText] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityType>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalForm, setGoalForm] = useState<typeof EMPTY_GOAL_FORM>(EMPTY_GOAL_FORM);
  const [savingGoal, setSavingGoal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem(STORAGE_KEY_TODOS);
      const storedGoals = localStorage.getItem(STORAGE_KEY_GOALS);
      if (storedTodos) setTodos(JSON.parse(storedTodos));
      if (storedGoals) setGoals(JSON.parse(storedGoals));
    } catch {}
  }, []);

  // Try to fetch from API, fall back to localStorage silently
  useEffect(() => {
    fetch('/api/todos')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.data?.length) setTodos(d.data);
      })
      .catch(() => {});
  }, []);

  const saveTodos = (updated: Todo[]) => {
    setTodos(updated);
    try { localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(updated)); } catch {}
    // Attempt API sync (fire and forget)
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos: updated }),
    }).catch(() => {});
  };

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    try { localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(updated)); } catch {}
  };

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo: Todo = {
      id: generateId(),
      text: newTodoText.trim(),
      completed: false,
      priority: newPriority,
      createdAt: new Date().toISOString(),
    };
    saveTodos([newTodo, ...todos]);
    setNewTodoText('');
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    if (todoFilter === 'active') return !t.completed;
    if (todoFilter === 'completed') return t.completed;
    return true;
  });

  const openAddGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      ...EMPTY_GOAL_FORM,
      start_date: new Date().toISOString().split('T')[0],
    });
    setShowGoalModal(true);
  };

  const openEditGoal = (g: Goal) => {
    setEditingGoal(g);
    setGoalForm({
      name: g.name,
      goal_type: g.goal_type,
      start_date: g.start_date ? g.start_date.split('T')[0] : '',
      end_date: g.end_date ? g.end_date.split('T')[0] : '',
      target_value: String(g.target_value),
      current_value: String(g.current_value),
    });
    setShowGoalModal(true);
  };

  const handleSaveGoal = async () => {
    if (!goalForm.name.trim() || !goalForm.target_value) return;
    setSavingGoal(true);

    if (editingGoal) {
      const updated = goals.map(g => g.id === editingGoal.id ? {
        ...g,
        name: goalForm.name,
        goal_type: goalForm.goal_type,
        start_date: goalForm.start_date,
        end_date: goalForm.end_date,
        target_value: parseFloat(goalForm.target_value) || 0,
        current_value: parseFloat(goalForm.current_value) || 0,
      } : g);
      saveGoals(updated);
    } else {
      const newGoal: Goal = {
        id: generateId(),
        name: goalForm.name,
        goal_type: goalForm.goal_type,
        start_date: goalForm.start_date,
        end_date: goalForm.end_date,
        target_value: parseFloat(goalForm.target_value) || 0,
        current_value: parseFloat(goalForm.current_value) || 0,
        status: 'active',
      };
      saveGoals([...goals, newGoal]);
    }

    setShowGoalModal(false);
    setSavingGoal(false);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const updateGoalProgress = (id: string, value: number) => {
    saveGoals(goals.map(g => {
      if (g.id !== id) return g;
      const status: Goal['status'] = value >= g.target_value ? 'completed' : 'active';
      return { ...g, current_value: value, status };
    }));
  };

  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;
  const activeGoals = goals.filter(g => g.status === 'active').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Todo & Goals</h1>
          <p className="page-subtitle">
            {activeTodos} active todo{activeTodos !== 1 ? 's' : ''} &middot; {activeGoals} active goal{activeGoals !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Todos */}
        <div>
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Todos
                <span className="text-xs text-gray-400 font-normal">({todos.length})</span>
              </span>
            </div>

            {/* Quick Add Input */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  className="form-input flex-1"
                  placeholder="Add a new todo..."
                  value={newTodoText}
                  onChange={e => setNewTodoText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTodo()}
                />
                <select
                  className="form-select w-28"
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as PriorityType)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={addTodo}
                  disabled={!newTodoText.trim()}
                  className="btn-primary shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-100">
              {(['all', 'active', 'completed'] as TodoFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setTodoFilter(f)}
                  className={`flex-1 py-2 text-sm font-medium transition-all capitalize ${
                    todoFilter === f
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                  {f === 'active' && activeTodos > 0 && (
                    <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">
                      {activeTodos}
                    </span>
                  )}
                  {f === 'completed' && completedTodos > 0 && (
                    <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">
                      {completedTodos}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Todo List */}
            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-10">
                  <CheckSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {todoFilter === 'completed' ? 'No completed todos' :
                     todoFilter === 'active' ? 'All caught up!' :
                     'No todos yet — add one above'}
                  </p>
                </div>
              ) : filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition-colors ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {todo.completed
                      ? <CheckSquare className="w-5 h-5 text-green-500" />
                      : <Square className="w-5 h-5" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                      {todo.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(todo.createdAt)}</p>
                  </div>
                  <span className={`badge text-xs shrink-0 ${PRIORITY_CONFIG[todo.priority].cls}`}>
                    <Flag className="w-2.5 h-2.5 mr-1" />
                    {PRIORITY_CONFIG[todo.priority].label}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="shrink-0 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {completedTodos > 0 && todoFilter !== 'active' && (
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={() => saveTodos(todos.filter(t => !t.completed))}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear {completedTodos} completed todo{completedTodos !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Goals */}
        <div>
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Goals
                <span className="text-xs text-gray-400 font-normal">({goals.length})</span>
              </span>
              <button
                onClick={openAddGoal}
                className="btn-primary text-xs px-3 py-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Goal
              </button>
            </div>

            {/* Goals List */}
            <div className="divide-y divide-gray-50 max-h-[calc(24rem+52px)] overflow-y-auto">
              {goals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No goals yet</p>
                  <p className="text-xs text-gray-300 mt-1">Track your targets and progress</p>
                  <button onClick={openAddGoal} className="btn-primary mt-4 mx-auto text-xs px-3 py-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Goal
                  </button>
                </div>
              ) : goals.map(goal => {
                const typeConf = GOAL_TYPE_CONFIG[goal.goal_type] || GOAL_TYPE_CONFIG.other;
                const TypeIcon = typeConf.icon;
                const progress = goal.target_value > 0
                  ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
                  : 0;
                const isCompleted = goal.status === 'completed' || progress >= 100;

                return (
                  <div key={goal.id} className="p-4 group hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center ${typeConf.color}`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{goal.name}</p>
                          <p className="text-xs text-gray-400">{typeConf.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => openEditGoal(goal)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        >
                          <Plus className="w-3.5 h-3.5 rotate-45" />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 text-gray-300 hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()}</span>
                        <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCompleted ? 'bg-green-500' : progress > 60 ? 'bg-blue-500' : 'bg-blue-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick update progress input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="form-input text-xs py-1 flex-1"
                        placeholder="Update current value..."
                        min="0"
                        onBlur={e => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) updateGoalProgress(goal.id, val);
                          e.target.value = '';
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const val = parseFloat((e.target as HTMLInputElement).value);
                            if (!isNaN(val)) updateGoalProgress(goal.id, val);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <span className={`badge text-xs shrink-0 ${
                        isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isCompleted ? 'Done' : 'Active'}
                      </span>
                    </div>

                    {(goal.start_date || goal.end_date) && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {goal.start_date && formatDate(goal.start_date)}
                        {goal.start_date && goal.end_date && ' – '}
                        {goal.end_date && formatDate(goal.end_date)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
              <button onClick={() => setShowGoalModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Goal Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Reach $10,000 in revenue"
                  value={goalForm.name}
                  onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Goal Type</label>
                <select
                  className="form-select"
                  value={goalForm.goal_type}
                  onChange={e => setGoalForm(f => ({ ...f, goal_type: e.target.value }))}
                >
                  {Object.entries(GOAL_TYPE_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Target Value *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="10000"
                    min="0"
                    value={goalForm.target_value}
                    onChange={e => setGoalForm(f => ({ ...f, target_value: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Current Value</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    value={goalForm.current_value}
                    onChange={e => setGoalForm(f => ({ ...f, current_value: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={goalForm.start_date}
                    onChange={e => setGoalForm(f => ({ ...f, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={goalForm.end_date}
                    onChange={e => setGoalForm(f => ({ ...f, end_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowGoalModal(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleSaveGoal}
                disabled={savingGoal || !goalForm.name.trim() || !goalForm.target_value}
                className="btn-primary"
              >
                {savingGoal ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {savingGoal ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
