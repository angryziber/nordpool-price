import {LitElement, html, css} from './deps/lit-element.js'
import {toLocalHour, toPerKWh} from './formatters.js'

customElements.define('price-graph', class extends LitElement {
  static properties = {
    prices: {type: Array},
    hour: {type: Number},
    hourDiff: {type: Number}
  }

  constructor() {
    super()
    this.prices = []
    this.hourDiff = 0
  }

  selected(h) {
    this.dispatchEvent(new CustomEvent('selected', {detail: h}))
  }

  static styles = css`
    .day-prices {
      display: flex;
      justify-content: space-between;
      list-style: none;
      padding: 0 1em;
      height: 150px;
    }
    
    li {
      display: block;
      position: relative;
      height: 100%;
      width: 3vw;
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
      font-size: 80%;
    }
  `

  render = () => html`
    <ul class="day-prices">
      ${this.prices?.map((p, h) => html`
        <li class="${h === this.hour ? 'now' : ''}" @click=${() => this.selected(h)} style="cursor: pointer">
          <div class="bar" style="height: ${p}px"></div>
          <div class="price">${toPerKWh(p)}</div>
          <div class="hour">${toLocalHour(h, this.hourDiff)}</div>
        </li>
      `)}
    </ul>
  `
})
