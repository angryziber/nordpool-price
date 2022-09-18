export const toFullKwhPrice = (p, taxPercent, gridPrice, finalPrices = true) => p >= 0 ? (p / 10) * (1 + (finalPrices ? taxPercent : 0) / 100) + (finalPrices ? gridPrice : 0) : 0
export const toPerKWh = p => p >= 0 ? (p / 10).toFixed(2) : '?'
export const toLocalHour = (h, diff) => (h + diff) % 24
