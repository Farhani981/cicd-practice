import { useEffect, useState } from 'react';
import ItemService from './services/items/ItemService';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [errorMessage, setErrorMessage] = useState('');

  // 1. GET: Saare todos fetch karna
  const fetchTodos = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await ItemService.getAll();

    if (res.success) {
      setTodos(res.data || []);
    } else {
      setErrorMessage(res.message || 'Backend se connect nahi ho saka. Port 3000 check karein.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. POST: Naya todo add karna
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    const res = await ItemService.create({
      title: title.trim(),
      description: description.trim(),
    });

    if (res.success) {
      setTitle('');
      setDescription('');
      fetchTodos();
    } else {
      alert(`Add error: ${res.message}`);
    }
    setSubmitting(false);
  };

  // 3. PATCH: Complete / Incomplete toggle karna
  const handleToggle = async (todo) => {
    const res = await ItemService.patch(todo._id, {
      isCompleted: !todo.isCompleted,
    });

    if (res.success) {
      // Optimistic update for quick UI feel
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
    } else {
      alert(`Update error: ${res.message}`);
    }
  };

  // 4. DELETE: Todo delete karna
  const handleDelete = async (id) => {
    const res = await ItemService.remove(id);
    if (res.success) {
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } else {
      alert(`Delete error: ${res.message}`);
    }
  };

  // Calculations for stats & progress
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const activeCount = totalCount - completedCount;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Filtered todos based on active tab
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true;
  });

  return (
    <div className="app-wrapper">
      <div className="todo-card">
        {/* Header */}
        <div className="app-header">
          <div className="header-top">
            <h1 className="app-title">
              <span className="title-icon">📋</span> Task Manager
            </h1>
            <span className="badge">{totalCount} Tasks</span>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="stats-text">
            <span>{completedCount} of {totalCount} completed</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* Backend Error Banner */}
        {errorMessage && (
          <div className="error-banner">
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={handleAdd} className="todo-form">
          <input
            type="text"
            className="input-title"
            placeholder="What needs to be done?..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-desc"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Adding...' : '+ Add Task'}
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <div className="empty-text">Loading tasks...</div>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <div className="empty-text">
              {filter === 'completed'
                ? 'No completed tasks yet!'
                : filter === 'active'
                  ? 'All tasks completed! Great job.'
                  : 'No tasks found. Add a new task above!'}
            </div>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}
              >
                <div className="todo-left">
                  <button
                    type="button"
                    className={`check-btn ${todo.isCompleted ? 'checked' : ''}`}
                    onClick={() => handleToggle(todo)}
                    title={todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.isCompleted ? '✓' : ''}
                  </button>

                  <div className="todo-content">
                    <div className="todo-title">{todo.title}</div>
                    {todo.description && (
                      <div className="todo-desc">{todo.description}</div>
                    )}
                  </div>
                </div>

                <div className="todo-right">
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(todo._id)}
                    title="Delete task"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
