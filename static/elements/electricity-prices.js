import {BaseElement, css, html} from '../deps/element.js'
import {toFullKwhPrice, toLocalHour} from './formatters.js'
import countries from '../countries.js'
import './price-card.js'
import './price-graph.js'
import './cost-calculator.js'

customElements.define('electricity-prices', class extends BaseElement {
  static properties = {
    country: {},
    dayPrices: {attribute: false},
    day: {},
    hour: {},
    index: {},
    graphDay: {attribute: false},
    calcHour: {attribute: false},
    gridPriceDay: {type: Number},
    gridPriceNight: {type: Number},
    taxPercent: {type: Number},
    comparisonPrice: {type: Number},
    withTax: {attribute: false, type: Boolean},
    withGrid: {attribute: false, type: Boolean}
  }

  constructor() {
    super()
    this.changeCountry(localStorage.getItem('country') || 'EE')
    this.withTax = true
    this.withGrid = false
    this.taxPercent = +localStorage['taxPercent'] || 23
    this.gridPriceDay = +localStorage['gridPriceDay'] || 7.41
    this.gridPriceNight = +localStorage['gridPriceNight'] || 4.28
    this.comparisonPrice = +localStorage['comparisonPrice'] || 16.03
    const cetDate = this.toCET(new Date())
    this.day = this.graphDay = cetDate.toLocaleDateString('lt')
    this.hour = this.calcHour = cetDate.getHours()
    this.index = this.hour * 4 + Math.floor(cetDate.getMinutes() / 15)
  }

  async loadPrices() {
    this.dayPrices = {}
    this.dayPrices = await fetch('/api/prices?country=' + this.country).then(res => res.json())
  }

  hourPrice(i = this.index) {
    const ps = this.dayPrices
    let d = this.day
    const dayPrices = ps[d]
    if (i > dayPrices.length - 1) {
      d = Object.keys(ps)[0]
      i -= dayPrices.length
    }
    else if (i < 0) {
      d = Object.keys(ps)[1]
      i += dayPrices.length
    }
    return toFullKwhPrice(ps[d]?.[i], this.taxPercent, this.withTax)
  }

  gridPrice(h = this.hour) {
    return this.withGrid ? (h >= 7 && h <= 22 ? this.gridPriceDay : this.gridPriceNight) : 0
  }

  hourPriceWithGrid(h = this.hour) {
    return (this.hourPrice(h) + this.gridPrice(h)).toFixed(1)
  }

  changeCountry(country) {
    this.country = country
    this.hourDiff = countries[this.country].hourDiff
    this.loadPrices()
    localStorage.setItem('country', country)
  }

  nextDay(n) {
    const days = Object.keys(this.dayPrices)
    const i = days.indexOf(this.graphDay)
    return i >= 0 && days[i + n] || this.graphDay
  }

  static styles = css`
    .row {
      display: flex;
      justify-content: center;
      width: 100%;
      overflow-x: hidden;
      padding: 0.5em 0;
    }
    
    .row .prev, .row .next {
      opacity: 0.3;
    }
    
    button, select {
      padding: 0.5rem 1rem;
    }
  `

  render = () => html`
    <h2>
      NordPool
      <select @input=${e => this.changeCountry(e.target.value)} >
        ${Object.keys(countries).map(code => html`
          <option ?selected=${this.country === code} value="${code}">${code}</option>
        `)}
      </select>
    </h2>
    <p class="muted">
      ${this.day} ${toLocalHour(this.hour, this.hourDiff)}-${toLocalHour(this.hour + 1, this.hourDiff)}
      <label><input type="checkbox" ?checked=${this.withTax} @change=${e => this.withTax = e.target.checked}> With Tax</label>
      <label><input type="checkbox" ?checked=${this.withGrid} @change=${e => this.withGrid = e.target.checked}> With Grid</label>
    </p>
    
    <div class="row">
      <price-card price=${this.hourPriceWithGrid(this.index - 1)} class="prev"/>
      <price-card price=${this.hourPriceWithGrid()} trend=${this.hourPrice(this.index + 1) - this.hourPrice()}/>
      <price-card price=${this.hourPriceWithGrid(this.index + 1)} class="next"/>
    </div>
    
    <price-graph .prices=${this.dayPrices[this.graphDay]} .dayOfWeek=${this.dayOfWeekNumber(this.graphDay)} hour=${this.graphDay === this.day && this.hour} 
                 hourDiff=${this.hourDiff} @selected=${e => this.calcHour = e.detail} 
                 .taxPercent=${this.taxPercent} .withTax=${this.withTax} .comparisonPrice=${this.comparisonPrice}
                 .gridPriceDay=${this.gridPriceDay} .gridPriceNight=${this.gridPriceNight} .withGrid=${this.withGrid}
    />
    <button @click=${() => this.graphDay = this.nextDay(-1)}>&laquo;</button>  
    <select @input=${e => this.graphDay = e.target.value} style="margin-top: 1.5em">
      ${Object.keys(this.dayPrices).map(day => html`<option ?selected=${this.graphDay === day} value="${day}">${day} ${this.dayOfWeek(day)}</option>`)}
    </select>
    <button @click=${() => this.graphDay = this.nextDay(1)}>&raquo;</button>
      
    <cost-calculator .hourPrices=${this.dayPrices[this.graphDay]?.concat(this.dayPrices[this.nextDay(-1)] || []) || []} 
                      startHour=${this.calcHour} hourDiff=${this.hourDiff} .dayOfWeek=${this.dayOfWeekNumber(this.graphDay)}
                     .taxPercent=${this.taxPercent} .gridPriceDay=${this.gridPriceDay} .gridPriceNight=${this.gridPriceNight} .comparisonPrice=${this.comparisonPrice} .finalPrices=${this.withTax}
                     @changed=${e => {this.taxPercent = e.detail.taxPercent; this.gridPriceDay = e.detail.gridPriceDay; this.gridPriceNight = e.detail.gridPriceNight; this.comparisonPrice = e.detail.comparisonPrice}}
                     style="margin-top: 1.5em"/>
  `

  toCET(d) {
    return new Date(d.toLocaleString('en-US', {timeZone: 'Europe/Stockholm'}))
  }

  dayOfWeekNumber(date) {
    return this.toCET(new Date(date)).getDay()
  }

  dayOfWeek(date) {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][this.dayOfWeekNumber(date)]
  }
})
