export const toFullKwhPrice = (p, taxPercent, withTax = true) =>
  (p / 10) * (1 + (withTax ? taxPercent : 0) / 100)

export const toGridKwhPrice = (dayPrice, nightPrice, hour, dayOfWeek, taxPercent, withGrid = true, withTax = true) =>
  (withGrid ? dayOfWeek > 0 && dayOfWeek < 6 && hour >= 6 && hour <= 21 ? dayPrice : nightPrice : 0) * (1 + (withTax ? taxPercent : 0) / 100)

export const toLocalHour = (h, diff) => (h + diff) % 24
