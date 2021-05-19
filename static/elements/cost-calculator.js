import {BaseElement, html, css} from '../deps/element.js'
import {toLocalHour} from './formatters.js'

customElements.define('cost-calculator', class extends BaseElement {
  static properties = {
    hourPrices: {type: Array},
    startHour: {type: Number},
    hourDiff: {type: Number},
    gridPrice: {type: Number},
    taxPercent: {type: Number},
    kW: {attribute: false},
    hours: {attribute: false},
    detailsOpen: {attribute: false},
  }

  constructor() {
    super()
    this.gridPrice = +localStorage['gridPrice'] || 5
    this.taxPercent = +localStorage['taxPercent'] || 20
    this.kW = +localStorage['kW'] || 1
    this.hours = +localStorage['hours'] || 1
    this.detailsOpen = false
  }

  selectPredefined(i) {
    this.kW = predefined[i].kW
    this.hours = predefined[i].h
  }

  calc() {
    let cents = 0
    for (let i = 0; i < this.hours; i++) {
      const hourPrice = this.hourPrices[(this.startHour + i) % this.hourPrices.length] / 10
      cents += this.kW * (hourPrice + this.gridPrice)
    }
    return cents * (1 + this.taxPercent / 100) / 100
  }

  updated() {
    const $cost = this.shadowRoot.querySelector('.cost')
    $cost.classList.add('updated')
    setTimeout(() => $cost.classList.remove('updated'), 500)
    localStorage['kW'] = this.kW
    localStorage['hours'] = this.hours
    localStorage['gridPrice'] = this.gridPrice
    localStorage['taxPercent'] = this.taxPercent
  }

  static styles = css`
    :host {
      display: block;
      width: 66%;
      max-width: 600px;
      margin: 0 auto;
      background: #eee;
      border: 1px solid lightgrey;
      padding: 1em;
    }

    input {
      width: 4em;
    }
    
    .field {
      margin-left: 1em;
    }
    
    @media screen and (max-width: 500px) {
      .field {
        display: block;
        margin: 0.5em 0;
      }
    }
    
    .cost {transition: background-color 0.5s}
    .cost.updated {background-color: yellow}
  `

  render = () => html`
    <select @input=${e => this.selectPredefined(e.target.selectedIndex)}>
      ${predefined.map(p => html`<option>${p.name}</option>`)}
    </select>
    <span class="field">
      <input type="number" .value=${this.kW} @input=${e => this.kW = e.target.value}> kW
    </span>
    <span class="field">
      start at ${toLocalHour(this.startHour, this.hourDiff)} for
      <input type="number" .value=${this.hours} @input=${e => this.hours = e.target.value}> h
    </span>
    
    = <strong class="cost">${this.calc().toFixed(2)} €</strong>

    <div style="margin-top: 1em">
      <button @click=${() => this.detailsOpen = !this.detailsOpen}>More ${this.detailsOpen ? '▴' : '▾'}</button>
    </div>
    <div style="margin-top: 1em; display: ${this.detailsOpen ? 'block' : 'none'}">
      <span class="field">
        Grid price <input type="number" .value=${this.gridPrice} @input=${e => this.gridPrice = e.target.value}> cents/kWh
      </span>
      <span class="field">
        Tax <input type="number" .value=${this.taxPercent} @input=${e => this.taxPercent = e.target.value}> %
      </span>
    </div>
  `
})

const predefined = [
  {name: 'Custom', kW: 1, h: 1},
  {name: 'Sauna', kW: 9, h: 3},
  {name: 'Heater', kW: 2.5, h: 8},
  {name: 'Nissan Leaf', kW: 3.3, h: 7.5},
  {name: 'Tesla Model 3', kW: 11, h: 5},
  {name: '100W light', kW: 0.1, h: 24},
  {name: 'Reference', kW: 1, h: 1}
]
