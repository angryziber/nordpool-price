export function nextDay(dayPrices: Record<string, number[]>, date: string, n: number) {
  const days = Object.keys(dayPrices)
  const i = days.indexOf(date)
  return i >= 0 && days[i + n] || date
}

export function dayOfWeekNumber(date: string) {
  return toCET(new Date(date)).getDay()
}

export function dayOfWeekName(date: string) {
  return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeekNumber(date)]
}

export function formattedPrice(p: number) {
  return +p.toFixed(1)
}

export function toCET(d: Date) {
  return new Date(d.toLocaleString('en-US', {timeZone: 'Europe/Stockholm'}))
}
