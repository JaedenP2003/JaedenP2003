import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { makeId } from '../utils/id'

export default function CountersView() {
  const [counters, setCounters] = useLocalStorage('planner:counters', [])
  const [name, setName] = useState('')

  function addCounter(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setCounters([...counters, { id: makeId(), name: trimmed, count: 0 }])
    setName('')
  }

  function bump(id, delta) {
    setCounters(
      counters.map((c) => (c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c))
    )
  }

  function resetCounter(id) {
    setCounters(counters.map((c) => (c.id === id ? { ...c, count: 0 } : c)))
  }

  function removeCounter(id) {
    setCounters(counters.filter((c) => c.id !== id))
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1>Counters</h1>
      </div>

      <form className="add-form" onSubmit={addCounter}>
        <input
          type="text"
          placeholder="Add a counter, e.g. Water bottles..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {counters.length === 0 && <p className="empty">No counters yet. Add one to start tracking.</p>}

      <div className="counter-grid">
        {counters.map((c) => (
          <div className="counter-card" key={c.id}>
            <div className="counter-card-header">
              <span className="counter-name">{c.name}</span>
              <button className="remove-btn" onClick={() => removeCounter(c.id)} aria-label={`Delete ${c.name}`}>&times;</button>
            </div>
            <div className="counter-controls">
              <button
                className="counter-btn"
                onClick={() => bump(c.id, -1)}
                disabled={c.count === 0}
                aria-label={`Decrease ${c.name}`}
              >
                &minus;
              </button>
              <span className="counter-value">{c.count}</span>
              <button
                className="counter-btn"
                onClick={() => bump(c.id, 1)}
                aria-label={`Increase ${c.name}`}
              >
                +
              </button>
            </div>
            <button className="link-btn counter-reset" onClick={() => resetCounter(c.id)}>Reset</button>
          </div>
        ))}
      </div>
    </div>
  )
}
