export function extractPrices(json) {
  const days = {}
  json.data.Rows.slice(0, 23).forEach(row => {
    row.Columns.forEach(col => {
      const date = col.Name.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')
      if (!days[date]) days[date] = []
      days[date].push(parseFloat(col.Value.replace(',', '.')))
    })
  })
  return days
}
