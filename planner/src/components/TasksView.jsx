import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { makeId } from '../utils/id'
import { today, addDays, formatDisplay, getWeekDates } from '../utils/date'

export default function TasksView() {
  const [tasks, setTasks] = useLocalStorage('planner:tasks', [])
  const [selectedDate, setSelectedDate] = useState(today())
  const [text, setText] = useState('')
  const [mode, setMode] = useState('day')
  const [editingId, setEditingId] = useState(null)
  const [draftText, setDraftText] = useState('')

  function addTask(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks([...tasks, { id: makeId(), text: trimmed, done: false, date: selectedDate }])
    setText('')
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  function moveTask(id, newDate) {
    if (!newDate) return
    setTasks(tasks.map((t) => (t.id === id ? { ...t, date: newDate } : t)))
  }

  function startEdit(task) {
    setEditingId(task.id)
    setDraftText(task.text)
  }

  function saveEdit(id) {
    const trimmed = draftText.trim()
    if (trimmed) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, text: trimmed } : t)))
    }
    setEditingId(null)
  }

  function handleEditKeyDown(e, id) {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  const weekDates = getWeekDates(selectedDate)
  const visibleDates = mode === 'day' ? [selectedDate] : weekDates

  return (
    <div className="view">
      <div className="view-header">
        <h1>Tasks</h1>
        <div className="segmented">
          <button className={mode === 'day' ? 'active' : ''} onClick={() => setMode('day')}>Day</button>
          <button className={mode === 'week' ? 'active' : ''} onClick={() => setMode('week')}>Week</button>
        </div>
      </div>

      <div className="date-nav">
        <button className="icon-btn" onClick={() => setSelectedDate(addDays(selectedDate, mode === 'day' ? -1 : -7))}>&larr;</button>
        <span className="date-label">
          {mode === 'day' ? formatDisplay(selectedDate) : `Week of ${formatDisplay(weekDates[0])}`}
        </span>
        <button className="icon-btn" onClick={() => setSelectedDate(addDays(selectedDate, mode === 'day' ? 1 : 7))}>&rarr;</button>
        <button className="link-btn" onClick={() => setSelectedDate(today())}>Today</button>
      </div>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder={mode === 'day' ? `Add a task for ${formatDisplay(selectedDate)}...` : 'Add a task...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className={mode === 'week' ? 'week-columns' : 'day-column'}>
        {visibleDates.map((date) => {
          const dayTasks = tasks.filter((t) => t.date === date)
          return (
            <div className="day-block" key={date}>
              {mode === 'week' && <h3>{formatDisplay(date)}</h3>}
              {dayTasks.length === 0 && <p className="empty">No tasks</p>}
              <ul className="task-list">
                {dayTasks.map((t) => (
                  <li key={t.id} className={t.done ? 'done' : ''}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      aria-label={`Mark ${t.text} done`}
                    />
                    {editingId === t.id ? (
                      <input
                        type="text"
                        className="task-edit-input"
                        value={draftText}
                        autoFocus
                        onChange={(e) => setDraftText(e.target.value)}
                        onBlur={() => saveEdit(t.id)}
                        onKeyDown={(e) => handleEditKeyDown(e, t.id)}
                      />
                    ) : (
                      <span className="task-text" onClick={() => startEdit(t)}>{t.text}</span>
                    )}
                    <input
                      type="date"
                      className="task-move-input"
                      value={t.date}
                      onChange={(e) => moveTask(t.id, e.target.value)}
                      aria-label={`Move ${t.text} to a different day`}
                    />
                    <button className="remove-btn" onClick={() => removeTask(t.id)} aria-label="Delete task">&times;</button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
