import countries from './countries.ts'

export default class Config {
  constructor(
    public country: keyof typeof countries = 'EE',
    public gridPriceDay = 7.41,
    public gridPriceNight = 4.28,
    public dayRateStart = 7,
    public dayRateEnd = 22,
    public taxPercent = 25,
    public comparisonPrice = 16.03,
  ) {
    this.load()
  }

  load() {
    Object.keys(this).forEach(key => {
      const v = localStorage.getItem(key)
      if (v !== null) this[key] = typeof this[key] === 'number' ? +v : v
    })
  }

  save() {
    Object.entries(this).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString())
    })
  }

  gridPrice(h: number) {
    return h >= this.dayRateStart && h < this.dayRateEnd ? this.gridPriceDay : this.gridPriceNight
  }
}
