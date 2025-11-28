export function toGridKwhPrice(dayPrice: number, nightPrice: number, hour: number, dayOfWeek: number, taxPercent: number, withGrid = true, withTax = true): number {
  return (withGrid ? dayOfWeek > 0 && dayOfWeek < 6 && hour >= 6 && hour <= 21 ? dayPrice : nightPrice : 0) * (1 + (withTax ? taxPercent : 0) / 100)
}
