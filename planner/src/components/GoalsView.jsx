import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { makeId } from '../utils/id'

export default function GoalsView() {
  const [goals, setGoals] = useLocalStorage('planner:goals', [])
  const [text, setText] = useState('')
  const [notes, setNotes] = useLocalStorage('planner:notes', '')

  function addGoal(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setGoals([...goals, { id: makeId(), text: trimmed, done: false }])
    setText('')
  }

  function toggleGoal(id) {
    setGoals(goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))
  }

  function removeGoal(id) {
    setGoals(goals.filter((g) => g.id !== id))
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1>Goals &amp; Notes</h1>
      </div>

      <section className="goals-section">
        <h2>Goals</h2>
        <form className="add-form" onSubmit={addGoal}>
          <input
            type="text"
            placeholder="Add a goal..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {goals.length === 0 && <p className="empty">No goals yet.</p>}
        <ul className="task-list">
          {goals.map((g) => (
            <li key={g.id} className={g.done ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={g.done} onChange={() => toggleGoal(g.id)} />
                <span>{g.text}</span>
              </label>
              <button className="remove-btn" onClick={() => removeGoal(g.id)} aria-label="Delete goal">&times;</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="notes-section">
        <h2>Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Jot down anything..."
          rows={10}
        />
      </section>
    </div>
  )
}
