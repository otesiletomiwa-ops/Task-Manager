import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

const FILTERS = ['all', 'pending', 'in-progress', 'completed'];

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTasks(token);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    const data = await api.createTask(payload, token);
    setTasks((prev) => [data.task, ...prev]);
  };

  const handleUpdate = async (id, payload) => {
    const data = await api.updateTask(id, payload, token);
    setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
  };

  const handleDelete = async (id) => {
    await api.deleteTask(id, token);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const visibleTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Ledger</p>
          <h1>{user?.name ? `${user.name}'s tasks` : 'Your tasks'}</h1>
        </div>
        <button className="btn-link" onClick={logout}>
          Sign out
        </button>
      </header>

      <TaskForm onCreate={handleCreate} />

      <nav className="filter-bar">
        {FILTERS.map((key) => (
          <button key={key} className={`filter-pill${filter === key ? ' active' : ''}`} onClick={() => setFilter(key)}>
            {key === 'all' ? 'All' : key === 'in-progress' ? 'In progress' : key[0].toUpperCase() + key.slice(1)}
            <span className="filter-count">{counts[key]}</span>
          </button>
        ))}
      </nav>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="subtext">Loading tasks…</p>
      ) : (
        <TaskList tasks={visibleTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </div>
  );
}
