export const config = {
  gridPriceDay: 7.41,
  gridPriceNight: 4.28,
  dayRateStart: 7,
  dayRateEnd: 22,
  taxPercent: 25,
  comparisonPrice: 16.03,
}

export function gridPrice(h: number) {
  return h >= config.dayRateStart && h < config.dayRateEnd ? config.gridPriceDay : config.gridPriceNight
}

Object.keys(config).forEach(key => {
  const v = localStorage.getItem(key)
  if (v !== null) config[key] = +v
})

export function saveConfig() {
  Object.entries(config).forEach(([key, value]) => {
    localStorage.setItem(key, value.toString())
  })
}
