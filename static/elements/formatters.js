export const toPerKWh = p => p >= 0 ? (p / 10).toFixed(2) : '?'
export const toLocalHour = (h, diff) => (h + diff) % 24
