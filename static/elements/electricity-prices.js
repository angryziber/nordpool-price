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
    graphDay: {attribute: false},
    calcHour: {attribute: false},
    gridPrice: {type: Number},
    taxPercent: {type: Number},
    comparisonPrice: {type: Number},
    withTax: {attribute: false, type: Boolean}
  }

  constructor() {
    super()
    this.changeCountry(localStorage.getItem('country') || 'EE')
    this.withTax = true
    this.taxPercent = +localStorage['taxPercent'] || 23
    this.gridPrice = +localStorage['gridPrice'] || 5.5
    this.comparisonPrice = +localStorage['comparisonPrice'] || 16.03
    const cetDate = this.toCET(new Date())
    this.day = this.graphDay = cetDate.toLocaleDateString('lt')
    this.hour = this.calcHour = cetDate.getHours()
  }

  async loadPrices() {
    const hourOffset = new Date().getTimezoneOffset() / -60
    this.dayPrices = {}
    this.dayPrices = await fetch('/api/prices?country=' + this.country + '&hourOffset=' + hourOffset).then(res => res.json())
  }

  hourPrice(h = this.hour) {
    const ps = this.dayPrices
    let d = this.day
    if (h > 23) {
      d = Object.keys(ps)[0]
      h -= 24
    }
    else if (h < 0) {
      d = Object.keys(ps)[1]
      h += 24
    }
    return toFullKwhPrice(ps[d]?.[h], this.taxPercent, this.withTax).toFixed(1)
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
    </p>
    
    <div class="row">
      <price-card price=${this.hourPrice(this.hour - 1)} class="prev"/>
      <price-card price=${this.hourPrice()} trend=${this.hourPrice(this.hour + 1) - this.hourPrice()}/>
      <price-card price=${this.hourPrice(this.hour + 1)} class="next"/>
    </div>
    
    <price-graph .prices=${this.dayPrices[this.graphDay]} hour=${this.graphDay === this.day && this.hour} 
                 hourDiff=${this.hourDiff} @selected=${e => this.calcHour = e.detail} 
                 .taxPercent=${this.taxPercent} .withTax=${this.withTax} .comparisonPrice=${this.comparisonPrice}/>
    <button @click=${() => this.graphDay = this.nextDay(-1)}>&laquo;</button>  
    <select @input=${e => this.graphDay = e.target.value} style="margin-top: 1.5em">
      ${Object.keys(this.dayPrices).map(day => html`<option ?selected=${this.graphDay === day} value="${day}">${day} ${this.dayOfWeek(day)}</option>`)}
    </select>
    <button @click=${() => this.graphDay = this.nextDay(1)}>&raquo;</button>
      
    <cost-calculator .hourPrices=${this.dayPrices[this.graphDay]?.concat(this.dayPrices[this.nextDay(-1)] || []) || []} startHour=${this.calcHour} hourDiff=${this.hourDiff}
                     .taxPercent=${this.taxPercent} .gridPrice=${this.gridPrice} .comparisonPrice=${this.comparisonPrice} .finalPrices=${this.withTax}
                     @changed=${e => {this.taxPercent = e.detail.taxPercent; this.gridPrice = e.detail.gridPrice; this.comparisonPrice = e.detail.comparisonPrice}}
                     style="margin-top: 1.5em"/>
  `

  toCET(d) {
    return new Date(d.toLocaleString('en-US', {timeZone: 'Europe/Stockholm'}))
  }

  dayOfWeek(date) {
    const d = this.toCET(new Date(date))
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()]
  }
})
