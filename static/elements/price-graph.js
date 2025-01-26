import {BaseElement, html, css} from '../deps/element.js'
import {toFullKwhPrice, toGridKwhPrice, toLocalHour} from './formatters.js'

customElements.define('price-graph', class extends BaseElement {
  static properties = {
    prices: {type: Array},
    dayOfWeek: {type: Number},
    hour: {type: Number},
    hourDiff: {type: Number},
    taxPercent: {type: Number},
    comparisonPrice: {type: Number},
    withTax: {type: Boolean},
    gridPriceDay: {type: Number},
    gridPriceNight: {type: Number},
    withGrid: {type: Boolean}
  }

  constructor() {
    super()
    this.prices = undefined
    this.hourDiff = 0
    this.comparisonPrice = 0
    this.withTax = true
  }

  selected(h) {
    this.dispatchEvent(new CustomEvent('selected', {detail: h}))
  }

  static styles = css`
    .day-prices {
      position: relative;
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
      display: flex;
      position: relative;
      height: 100%;
      width: 5%;
      margin: 0 0.3%;
    }
    
    .price, .bars {
      position: absolute;
      bottom: 0;
      left: 0; right: 0;
      overflow: hidden;
    }
    
    .bars {
      z-index: -1;
      display: flex;
      flex-direction: column;
      justify-content: end;
      height: 100%;
    }
    
    .bars .electricity, .bars .grid {
      height: 0;
      transition: height 0.4s 0.1s;
      width: 100%;
    }
    
    .bars .electricity {
      background: lightblue;
    }

    .bars .grid {
      background: lightpink;
    }
    
    .bars .negative {
      transform-origin: bottom;
      transform: scaleY(-1);
    }
    
    .now .bars .electricity {
      background: lightgreen;
    }
    
    .hour, .line {
      position: absolute;
      bottom: -1.5em;
      white-space: nowrap;
      left: 0; right: 0;
      color: gray;
    }
    
    .line {
      border-top: 1px dashed red;
    }
  `

  render = () => html`
    <ul class="day-prices">
      <div class="line" style="height: ${toFullKwhPrice(this.comparisonPrice * 10, this.taxPercent, this.withTax) * 10}px"></div>
      ${(this.prices || Array(24).fill(0)).map((p, h) => {
        const price = toFullKwhPrice(p, this.taxPercent, this.withTax)
        const gridPrice = toGridKwhPrice(this.gridPriceDay, this.gridPriceNight, h, this.dayOfWeek, this.taxPercent, this.withGrid, this.withTax)
        const total = price + gridPrice
        return html`
          <li class="${h === this.hour ? 'now' : ''}" 
              @click=${() => this.selected(h)} style="cursor: pointer">
            <div class="bars">
              <div class="electricity ${total < 0 ? 'negative' : ''}" style="height: ${Math.abs(price) * 10}px"></div>
              <div class="grid" style="height: ${gridPrice * 10}px"></div>
            </div>
            <div class="price">${total.toFixed(1)}</div>
            <div class="hour">${toLocalHour(h, this.hourDiff)}</div>
          </li>
        `
      })}
    </ul>
  `
})
