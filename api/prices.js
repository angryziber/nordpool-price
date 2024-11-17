export function extractPrices(json, country, hourOffset) {
  const days = {}
  json.data[country.toLowerCase()].forEach(p => {
    // TODO: wintertime here, from 1am
    const date = new Date((p.timestamp + hourOffset * 60 * 60) * 1000).toISOString().split('T')[0]
    const day = days[date] ??= []
    day.push(p.price)
  })
  return days
}
