import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element'
import {toPerKWh} from './formatters.js'
import './price-card.js'
import './price-graph.js'

customElements.define('electricity-prices', class extends LitElement {
  static properties = {
    country: {},
    dayPrices: {attribute: false},
    date: {},
    hour: {}
  }

  constructor() {
    super()
    this.country = 'EE'
    const cetDate = new Date()
    cetDate.setMinutes(-60)
    this.date = cetDate.toLocaleDateString('lt')
    this.hour = cetDate.getHours()
    this.loadPrices()
  }

  loadPrices() {
    this.dayPrices = {}
    fetch('/api/prices?country=' + this.country).then(res => res.json()).then(data => this.dayPrices = data)
  }

  hourPrice(h = this.hour) {
    let d = this.date
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
    :host {
      text-align: center;
    }
    
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
        
    h2 select {
      font-size: 100%;
      font-weight: bold;
    }      
  `

  render = () => html`
    <h2>
      NordPool
      <select .value="${this.country}" @change="${this.changeCountry}">
        <option>EE</option>
        <option>FI</option>
        <option>LV</option>
        <option>LT</option>
      </select>
    </h2>
    <div class="row">
      <price-card price=${this.hourPrice(this.hour - 1)} class="prev"></price-card>
      <price-card price=${this.hourPrice()} trend=${this.hourPrice(this.hour + 1) - this.hourPrice()}></price-card>
      <price-card price=${this.hourPrice(this.hour + 1)} class="next"></price-card>
    </div>
    <p>${this.date} ${this.hour}-${this.hour + 1} CET</p>
    <price-graph .prices=${this.dayPrices[this.date]} hour=${this.hour}></price-graph>
  `
})
