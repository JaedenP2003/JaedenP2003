import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { makeId } from '../utils/id'
import { today, toISODate, formatMonthYear, isSameMonth, getMonthGrid } from '../utils/date'

export default function CalendarView() {
  const [events, setEvents] = useLocalStorage('planner:events', [])
  const [cursor, setCursor] = useState(today())
  const [selectedDate, setSelectedDate] = useState(today())
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  const grid = getMonthGrid(cursor)

  function shiftMonth(delta) {
    const d = new Date(cursor + 'T00:00:00')
    d.setMonth(d.getMonth() + delta)
    setCursor(toISODate(d))
  }

  function addEvent(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setEvents([...events, { id: makeId(), title: trimmed, date: selectedDate, time }])
    setTitle('')
    setTime('')
  }

  function removeEvent(id) {
    setEvents(events.filter((ev) => ev.id !== id))
  }

  const selectedEvents = events
    .filter((ev) => ev.date === selectedDate)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))

  const eventsByDate = events.reduce((acc, ev) => {
    acc[ev.date] = (acc[ev.date] || 0) + 1
    return acc
  }, {})

  return (
    <div className="view">
      <div className="view-header">
        <h1>Calendar</h1>
      </div>

      <div className="date-nav">
        <button className="icon-btn" onClick={() => shiftMonth(-1)}>&larr;</button>
        <span className="date-label">{formatMonthYear(cursor)}</span>
        <button className="icon-btn" onClick={() => shiftMonth(1)}>&rarr;</button>
        <button className="link-btn" onClick={() => { setCursor(today()); setSelectedDate(today()) }}>Today</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div className="calendar-weekday" key={d}>{d}</div>
        ))}
        {grid.map((date) => (
          <button
            key={date}
            className={
              'calendar-cell' +
              (isSameMonth(date, cursor) ? '' : ' muted') +
              (date === selectedDate ? ' selected' : '') +
              (date === today() ? ' today' : '')
            }
            onClick={() => setSelectedDate(date)}
          >
            <span>{Number(date.slice(8, 10))}</span>
            {eventsByDate[date] && <span className="dot" />}
          </button>
        ))}
      </div>

      <div className="events-panel">
        <h2>{selectedDate === today() ? 'Today' : selectedDate}</h2>
        <form className="add-form" onSubmit={addEvent}>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <input
            type="text"
            placeholder="Add an event..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {selectedEvents.length === 0 && <p className="empty">No events</p>}
        <ul className="event-list">
          {selectedEvents.map((ev) => (
            <li key={ev.id}>
              {ev.time && <span className="event-time">{ev.time}</span>}
              <span className="event-title">{ev.title}</span>
              <button className="remove-btn" onClick={() => removeEvent(ev.id)} aria-label="Delete event">&times;</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
