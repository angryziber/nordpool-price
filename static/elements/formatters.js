export const toFullKwhPrice = (p, taxPercent, gridPrice) => p >= 0 ? (p / 10) * (1 + taxPercent / 100) + gridPrice : 0
export const toPerKWh = p => p >= 0 ? (p / 10).toFixed(2) : '?'
export const toLocalHour = (h, diff) => (h + diff) % 24
