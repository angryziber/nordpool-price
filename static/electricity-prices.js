import {LitElement, html, css} from './deps/lit-element.js'
import {toPerKWh} from './formatters.js'
import './price-card.js'
import './price-graph.js'
import './country-select.js'

customElements.define('electricity-prices', class extends LitElement {
  static properties = {
    country: {},
    dayPrices: {attribute: false},
    day: {},
    hour: {},
    graphDay: {attribute: false}
  }

  constructor() {
    super()
    this.country = 'EE'
    const cetDate = new Date()
    cetDate.setMinutes(-60)
    this.day = this.graphDay = cetDate.toLocaleDateString('lt')
    this.hour = cetDate.getHours()
    this.loadPrices()
  }

  loadPrices() {
    this.dayPrices = {}
    fetch('/api/prices?country=' + this.country).then(res => res.json()).then(data => this.dayPrices = data)
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

  changeCountry(e) {
    this.country = e.target.value
    this.loadPrices()
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
    }
  `

  render = () => html`
    <h2>
      NordPool
      <country-select country=${this.country} @change=${this.changeCountry}/>
    </h2>
    <p class="muted">${this.day} ${this.hour}-${this.hour + 1} CET</p>
    <div class="row">
      <price-card price=${this.hourPrice(this.hour - 1)} class="prev"/>
      <price-card price=${this.hourPrice()} trend=${this.hourPrice(this.hour + 1) - this.hourPrice()}/>
      <price-card price=${this.hourPrice(this.hour + 1)} class="next"/>
    </div>
    <price-graph .prices=${this.dayPrices[this.graphDay]} hour=${this.graphDay === this.day && this.hour}/>
    <select @change=${e => this.graphDay = e.target.value} style="margin-top: 2em">
      ${Object.keys(this.dayPrices).reverse().map(day => html`<option ?selected=${this.graphDay === day}>${day}</option>`)}
    </select>  
  `
})
