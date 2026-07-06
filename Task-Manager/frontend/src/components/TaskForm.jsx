import { useState } from 'react';

const initial = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.dueDate) {
      setError('Due date is required.');
      return;
    }

    setSubmitting(true);
    try {
      const isoDueDate = new Date(form.dueDate).toISOString();
      await onCreate({ ...form, dueDate: isoDueDate });
      setForm(initial);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-row">
        <input
          type="text"
          name="title"
          placeholder="New task title"
          required
          value={form.title}
          onChange={handleChange}
          className="task-title-input"
        />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} required />
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add task'}
        </button>
      </div>
      <input
        type="text"
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        className="task-desc-input"
      />
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
