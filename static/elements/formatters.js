export const toFullKwhPrice = (p, taxPercent, withTax = true) => (p / 10) * (1 + (withTax ? taxPercent : 0) / 100)
export const toGridKwhPrice = (day, night, hour, taxPercent, withGrid = true, withTax = true) => (withGrid ? hour >= 6 && hour <= 21 ? day : night : 0) * (1 + (withTax ? taxPercent : 0) / 100)
export const toLocalHour = (h, diff) => (h + diff) % 24
