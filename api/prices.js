export function extractPrices(json, country, hourDiff) {
  const days = {}
  json.data[country.toLowerCase()].forEach(p => {
    const date = new Date((p.timestamp - hourDiff * 60 * 60) * 1000).toLocaleDateString('lt')
    const day = days[date] ??= []
    day.push(p.price)
  })
  return days
}
