import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { makeId } from '../utils/id'
import { today, addDays, formatDisplay } from '../utils/date'

const DAYS_SHOWN = 7

function getStreak(completions) {
  let streak = 0
  let cursor = today()
  while (completions[cursor]) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export default function HabitsView() {
  const [habits, setHabits] = useLocalStorage('planner:habits', [])
  const [name, setName] = useState('')

  const dates = Array.from({ length: DAYS_SHOWN }, (_, i) => addDays(today(), i - (DAYS_SHOWN - 1)))

  function addHabit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits([...habits, { id: makeId(), name: trimmed, completions: {} }])
    setName('')
  }

  function toggleCompletion(id, date) {
    setHabits(
      habits.map((h) => {
        if (h.id !== id) return h
        const completions = { ...h.completions }
        if (completions[date]) delete completions[date]
        else completions[date] = true
        return { ...h, completions }
      })
    )
  }

  function removeHabit(id) {
    setHabits(habits.filter((h) => h.id !== id))
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1>Habits</h1>
      </div>

      <form className="add-form" onSubmit={addHabit}>
        <input
          type="text"
          placeholder="Add a habit to track..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {habits.length === 0 && <p className="empty">No habits yet. Add one to start tracking.</p>}

      {habits.length > 0 && (
        <div className="table-scroll">
          <table className="habit-table">
            <thead>
              <tr>
                <th></th>
                {dates.map((d) => (
                  <th key={d}>{formatDisplay(d).slice(0, 3)}</th>
                ))}
                <th>Streak</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h.id}>
                  <td className="habit-name">{h.name}</td>
                  {dates.map((d) => (
                    <td key={d}>
                      <button
                        className={'habit-cell' + (h.completions[d] ? ' checked' : '')}
                        onClick={() => toggleCompletion(h.id, d)}
                        aria-label={`Toggle ${h.name} for ${d}`}
                      />
                    </td>
                  ))}
                  <td className="streak">{getStreak(h.completions)}🔥</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeHabit(h.id)} aria-label="Delete habit">&times;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
