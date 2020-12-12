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

  hourPrice(h = this.hour) {
    let d = this.date
    return ((this.dayPrices?.[d]?.[h] ?? Infinity) / 1000).toFixed(4)
  }

  static styles = css`
    :host {
      text-align: center;
    }`

  render = () => html`
    <h2>${this.country} current price</h2>
    <h1>${this.hourPrice()} <small>€/kWh</small></h1>
    <p>${this.date} ${this.hour}-${this.hour + 1} CET</p>
    <h3>Prev: ${this.hourPrice(this.hour - 1)}, Next: ${this.hourPrice(this.hour + 1)}</h3>
  `
})
