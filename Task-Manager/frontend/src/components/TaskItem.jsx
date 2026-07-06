import { useState } from 'react';

const STATUS_CYCLE = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
const STATUS_LABEL = { pending: 'Pending', 'in-progress': 'In progress', completed: 'Completed' };

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: toLocalInput(task.dueDate),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();

  const cycleStatus = async () => {
    setBusy(true);
    setError('');
    try {
      await onUpdate(task.id, { status: STATUS_CYCLE[task.status] });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onUpdate(task.id, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: new Date(form.dueDate).toISOString(),
      });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      await onDelete(task.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <form className="task-row task-row-editing" onSubmit={handleSave}>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="datetime-local"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />
        <div className="task-row-actions">
          <button type="submit" className="btn-link" disabled={busy}>
            Save
          </button>
          <button type="button" className="btn-link" onClick={() => setEditing(false)} disabled={busy}>
            Cancel
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>
    );
  }

  return (
    <div className={`task-row status-${task.status}${isOverdue ? ' is-overdue' : ''}`}>
      <button
        className="status-dot"
        onClick={cycleStatus}
        disabled={busy}
        title={`Mark as ${STATUS_LABEL[STATUS_CYCLE[task.status]]}`}
        aria-label={`Status: ${STATUS_LABEL[task.status]}. Click to advance.`}
      />
      <div className="task-main">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>
      <span className={`tag tag-${task.priority}`}>{task.priority}</span>
      <span className="task-due">{formatDue(task.dueDate)}</span>
      <div className="task-row-actions">
        <button className="btn-link" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="btn-link btn-danger" onClick={handleDelete} disabled={busy}>
          Delete
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function toLocalInput(isoDate) {
  const d = new Date(isoDate);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDue(isoDate) {
  return new Date(isoDate).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
