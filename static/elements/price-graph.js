import {BaseElement, html, css} from '../deps/element.js'
import {toFullKwhPrice, toLocalHour, toPerKWh} from './formatters.js'

customElements.define('price-graph', class extends BaseElement {
  static properties = {
    prices: {type: Array},
    hour: {type: Number},
    hourDiff: {type: Number},
    taxPercent: {type: Number},
    withTax: {type: Boolean}
  }

  constructor() {
    super()
    this.prices = undefined
    this.hourDiff = 0
    this.taxPercent = 0
    this.withTax = true
  }

  selected(h) {
    this.dispatchEvent(new CustomEvent('selected', {detail: h}))
  }

  static styles = css`
    .day-prices {
      max-width: 1000px;
      margin: 0 auto;      
      padding: 0 1em;
      display: flex;
      justify-content: space-between;
      list-style: none;
      height: 40vh;
      min-height: 200px;
      font-size: 80%;
    }
    
    li {
      display: block;
      position: relative;
      height: 100%;
      width: 5%;
      margin: 0 0.3%;
    }
    
    .price, .bar {
      position: absolute;
      bottom: 0;
      left: 0; right: 0;
      overflow: hidden;
    }
    
    .bar {
      background: lightblue;
      z-index: -1;
      height: 0;
      transition: height 0.4s 0.1s;
    }
    
    .now .bar {
      background: lightgreen;
    }
    
    .hour {
      position: absolute;
      bottom: -1.5em;
      white-space: nowrap;
      left: 0; right: 0;
      color: gray;
    }
  `

  render = () => html`
    <ul class="day-prices">
      ${(this.prices || Array(24).fill(0)).map((p, h) => html`
        <li class="${h === this.hour ? 'now' : ''}" @click=${() => this.selected(h)} style="cursor: pointer">
          <div class="bar" style="height: ${toFullKwhPrice(p, this.taxPercent, this.withTax) * 10}px"></div>
          <div class="price">${toFullKwhPrice(p, this.taxPercent, this.withTax).toFixed(1)}</div>
          <div class="hour">${toLocalHour(h, this.hourDiff)}</div>
        </li>
      `)}
    </ul>
  `
})
