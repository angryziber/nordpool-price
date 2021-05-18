import {BaseElement, html, css} from '../deps/element.js'
import {toLocalHour, toPerKWh} from './formatters.js'
import countries from '../countries.js'
import './price-card.js'
import './price-graph.js'
import './country-select.js'
import './cost-calculator.js'

customElements.define('electricity-prices', class extends BaseElement {
  static properties = {
    country: {},
    dayPrices: {attribute: false},
    day: {},
    hour: {},
    graphDay: {attribute: false},
    calcHour: {attribute: false}
  }

  constructor() {
    super()
    this.changeCountry(localStorage.getItem('country') ?? 'EE')
    const cetDate = new Date()
    cetDate.setMinutes(-this.hourDiff * 60)
    this.day = this.graphDay = cetDate.toLocaleDateString('lt')
    this.hour = this.calcHour = cetDate.getHours()
  }

  async loadPrices() {
    this.dayPrices = {}
    this.dayPrices = await fetch('/api/prices?country=' + this.country).then(res => res.json())
  }

  hourPrice(h = this.hour) {
    let d = this.day
    if (h > 23) {
      d = Object.keys(this.dayPrices)[0]
      h -= 24
    }
    else if (h < 0) {
      d = Object.keys(this.dayPrices)[1]
      h += 24
    }
    return toPerKWh(this.dayPrices[d]?.[h])
  }

  changeCountry(country) {
    this.country = country
    this.hourDiff = countries[this.country].hourDiff
    this.loadPrices()
    localStorage.setItem('country', country)
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
            
    .muted {
      color: gray;
      font-size: 80%;
    }    
  `

  render = () => html`
    <h2>
      NordPool
      <country-select country=${this.country} @input=${e => this.changeCountry(e.path[0].value)}/>
    </h2>
    <p class="muted">${this.day} ${toLocalHour(this.hour, this.hourDiff)}-${toLocalHour(this.hour + 1, this.hourDiff)}</p>
    
    <div class="row">
      <price-card price=${this.hourPrice(this.hour - 1)} class="prev"/>
      <price-card price=${this.hourPrice()} trend=${this.hourPrice(this.hour + 1) - this.hourPrice()}/>
      <price-card price=${this.hourPrice(this.hour + 1)} class="next"/>
    </div>
    
    <price-graph .prices=${this.dayPrices[this.graphDay]} hour=${this.graphDay === this.day && this.hour} 
                 hourDiff=${this.hourDiff} @selected=${e => this.calcHour = e.detail}/>
    <select @input=${e => this.graphDay = e.target.value} style="margin-top: 1.5em">
      ${Object.keys(this.dayPrices).reverse().map(day => html`<option ?selected=${this.graphDay === day} value="${day}">${day} ${this.dayOfWeek(day)}</option>`)}
    </select>
    
    <cost-calculator .hourPrices=${this.dayPrices[this.graphDay]} startHour=${this.calcHour} hourDiff=${this.hourDiff} style="margin-top: 1.5em"/>
      
    <p>
      <a class="muted" target="_blank" href="https://www.nordpoolgroup.com/Market-data1/Dayahead/Area-Prices/${this.country}/Hourly/">Data source</a>
    </p>  
  `

  dayOfWeek(date) {
    const n = new Date(date).getDay()
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][n]
  }
})
