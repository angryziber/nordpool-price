import {BaseElement, html, css} from '../deps/element.js'
import {toFullKwhPrice, toLocalHour} from './formatters.js'

customElements.define('cost-calculator', class extends BaseElement {
  static properties = {
    hourPrices: {type: Array},
    startHour: {type: Number},
    hourDiff: {type: Number},
    gridPriceDay: {type: Number},
    gridPriceNight: {type: Number},
    taxPercent: {type: Number},
    comparisonPrice: {type: Number},
    finalPrices: {type: Boolean},
    kW: {attribute: false},
    hours: {attribute: false},
    detailsOpen: {attribute: false},
  }

  constructor() {
    super()
    this.gridPriceDay = 0
    this.gridPriceNight = 0
    this.taxPercent = 0
    this.comparisonPrice = 0
    this.finalPrices = true
    this.detailsOpen = false
    this.predefined = predefined[navigator.userAgent.includes('Tesla') ? 4 : 0]
    this.kW = +localStorage['kW'] || this.predefined.kW
    this.hours = +localStorage['hours'] || this.predefined.h
  }

  selectPredefined(i) {
    this.kW = predefined[i].kW
    this.hours = predefined[i].h
  }

  calc() {
    let cents = 0
    for (let i = 0; i < this.hours; i++) {
      const p = this.hourPrices[(this.startHour + i) % this.hourPrices.length]
      const isDay = this.startHour + i >= 7 && this.startHour + i <= 22
      const gridPrice = isDay ? this.gridPriceDay : this.gridPriceNight
      cents += this.kW * (toFullKwhPrice(p, this.taxPercent, this.finalPrices) + (this.finalPrices ? gridPrice : 0))
    }
    return cents / 100
  }

  updated() {
    const $cost = this.shadowRoot.querySelector('.cost')
    $cost.classList.add('updated')
    setTimeout(() => $cost.classList.remove('updated'), 500)
    localStorage['kW'] = this.kW
    localStorage['hours'] = this.hours
    localStorage['gridPriceDay'] = this.gridPriceDay
    localStorage['gridPriceNight'] = this.gridPriceNight
    localStorage['taxPercent'] = this.taxPercent
    localStorage['comparisonPrice'] = this.comparisonPrice
    this.dispatchEvent(new CustomEvent('changed', {detail: {gridPriceDay: this.gridPriceDay, gridPriceNight: this.gridPriceNight, taxPercent: this.taxPercent, comparisonPrice: this.comparisonPrice}}))
  }

  static styles = css`
    :host {
      display: block;
      width: 66%;
      max-width: 600px;
      margin: 0 auto;
      background: var(--mid-color);
      border: 1px solid lightgray;
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
      ${predefined.map(p => html`<option ?selected=${p === this.predefined}>${p.name}</option>`)}
    </select>
    <span class="field">
      <input type="number" .value=${this.kW} @input=${e => this.kW = +e.target.value}> kW
    </span>
    <span class="field">
      start at ${toLocalHour(this.startHour, this.hourDiff)} for
      <input type="number" .value=${this.hours} @input=${e => this.hours = +e.target.value}> h
    </span>
    
    = <strong class="cost">${this.calc().toFixed(2)} €</strong>

    <div style="margin-top: 1em">
      <button @click=${() => this.detailsOpen = !this.detailsOpen}>More ${this.detailsOpen ? '▴' : '▾'}</button>
    </div>
    <div style="margin-top: 1em; display: ${this.detailsOpen ? 'block' : 'none'}">
      <span class="field">
        Grid price day <input type="number" .value=${this.gridPriceDay} @input=${e => this.gridPriceDay = +e.target.value}> ¢/kWh
      </span>
      <span class="field">
        Grid price night <input type="number" .value=${this.gridPriceNight} @input=${e => this.gridPriceNight = +e.target.value}> ¢/kWh
      </span>
      <div style="margin-top: 0.5em"></div>
      <span class="field">
        Tax <input type="number" .value=${this.taxPercent} @input=${e => this.taxPercent = +e.target.value}> %
      </span>
      <span class="field">
        Comparison <input type="number" .value=${this.comparisonPrice} @input=${e => this.comparisonPrice = +e.target.value}> ¢/kWh
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
  {name: 'Tesla Model Y', kW: 11, h: 6.8},
  {name: '100W light', kW: 0.1, h: 24},
  {name: 'Reference', kW: 1, h: 1}
]
