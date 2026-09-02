import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { makeId } from '../utils/id'
import { today, addDays, formatDisplay, getWeekDates } from '../utils/date'

export default function TasksView() {
  const [tasks, setTasks] = useLocalStorage('planner:tasks', [])
  const [selectedDate, setSelectedDate] = useState(today())
  const [text, setText] = useState('')
  const [mode, setMode] = useState('day')

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
                    <label>
                      <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                      <span>{t.text}</span>
                    </label>
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
