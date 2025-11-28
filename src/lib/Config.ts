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
    public withTax = true,
    public withGrid = false,
  ) {
    this.load()
  }

  get hourDiff() {
    return countries[this.country].hourDiff
  }

  toLocalHour(h: number){
    return (h + this.hourDiff) % 24
  }

  load() {
    Object.assign(this, JSON.parse(localStorage.getItem('config') ?? '{}'))
  }

  save() {
    localStorage.setItem('config', JSON.stringify(this))
  }

  gridPrice(h: number) {
    return h >= this.dayRateStart && h < this.dayRateEnd ? this.gridPriceDay : this.gridPriceNight
  }
}
