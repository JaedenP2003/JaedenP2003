export function toISODate(date) {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export function today() {
  return toISODate(new Date())
}

export function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function startOfWeek(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return toISODate(d)
}

export function getWeekDates(isoDate) {
  const start = startOfWeek(isoDate)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function formatDisplay(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatMonthYear(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function isSameMonth(isoA, isoB) {
  return isoA.slice(0, 7) === isoB.slice(0, 7)
}

export function getMonthGrid(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  const firstOfMonth = toISODate(new Date(d.getFullYear(), d.getMonth(), 1))
  const gridStart = startOfWeek(firstOfMonth)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}
