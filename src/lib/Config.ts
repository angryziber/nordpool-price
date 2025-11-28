import countries from './countries.ts'

export const pricesPerHour = 4
export const pricesPerDay = pricesPerHour * 24

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
  
  addTax(p: number) {
    return p * (1 + (this.withTax ? this.taxPercent : 0) / 100)
  }

  gridPrice(h: number, dayOfWeek = 1) {
    const isDayPrice = dayOfWeek > 0 && dayOfWeek < 6 && h >= this.dayRateStart && h < this.dayRateEnd
    return this.addTax(isDayPrice ? this.gridPriceDay : this.gridPriceNight)
  }

  toKWhPrice(p: number) {
    return this.addTax(p / 10)
  }

  toFullPrice(p: number, h: number, dayOfWeek = 1) {
    return this.toKWhPrice(p) + (this.withGrid ? this.gridPrice(h, dayOfWeek) : 0)
  }

  load() {
    Object.assign(this, JSON.parse(localStorage.getItem('config') ?? '{}'))
  }

  save() {
    localStorage.setItem('config', JSON.stringify(this))
  }
}
