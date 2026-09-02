import { useState } from 'react'
import TasksView from './components/TasksView'
import CalendarView from './components/CalendarView'
import HabitsView from './components/HabitsView'
import GoalsView from './components/GoalsView'

const TABS = [
  { id: 'tasks', label: 'Tasks', component: TasksView },
  { id: 'calendar', label: 'Calendar', component: CalendarView },
  { id: 'habits', label: 'Habits', component: HabitsView },
  { id: 'goals', label: 'Goals & Notes', component: GoalsView },
]

function exportData() {
  const data = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key && key.startsWith('planner:')) {
      data[key] = JSON.parse(window.localStorage.getItem(key))
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `planner-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(file, onDone) {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result)
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('planner:')) {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      })
      onDone()
    } catch {
      alert('Could not read that file.')
    }
  }
  reader.readAsText(file)
}

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const Active = TABS.find((t) => t.id === activeTab).component

  return (
    <div className="app">
      <nav className="tab-nav">
        <span className="brand">
          <img src="./triforce.svg" alt="" className="brand-icon" />
          Planner
        </span>
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={activeTab === t.id ? 'active' : ''}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="data-actions">
          <button className="link-btn" onClick={exportData}>Export</button>
          <label className="link-btn import-label">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) importData(file, () => window.location.reload())
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </nav>
      <main className="content">
        <Active />
      </main>
      <footer className="app-footer">
        Everything is stored locally in your browser — nothing leaves this device.
      </footer>
    </div>
  )
}
