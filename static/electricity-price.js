import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element'

customElements.define('electricity-price', class extends LitElement {
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
    this.dayPrices = {}

    fetch('/api/prices?country=' + this.country).then(res => res.json()).then(data => this.dayPrices = data)
  }

  toPerKWh = p => p >= 0 ? (p / 10).toFixed(2) : '?'

  hourPrice(h = this.hour) {
    let d = this.date
    if (h > 23) {
      d = Object.keys(this.dayPrices)[0]
      h -= 24
    }
    return this.toPerKWh(this.dayPrices[d]?.[h])
  }

  static styles = css`
    :host {
      text-align: center;
    }
    
    ul.day-prices {
      display: block;
      list-style: none;
    }
    
    ul.day-prices li {
      display: inline-block;
      margin-right: 1em;
    }
    
    .now {
      color: red;
    }
  `

  render = () => html`
    <h2>${this.country} current price</h2>
    <h1>${this.hourPrice()} <small>cents/kWh</small></h1>
    <p>${this.date} ${this.hour}-${this.hour + 1} CET</p>
    <h3>Prev: ${this.hourPrice(this.hour - 1)}, Next: ${this.hourPrice(this.hour + 1)}</h3>
    <ul class="day-prices">
      ${this.dayPrices[this.date].map((p, h) => html`<li class="${h === this.hour ? 'now' : ''}">${this.toPerKWh(p)}</li>`)}
    </ul>
  `
})
