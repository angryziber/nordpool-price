import {LitElement, html, css} from './deps/lit-element.js'

customElements.define('cost-calculator', class extends LitElement {
  static properties = {
    price: {type: Number},
    gridPrice: {type: Number},
    taxPercent: {type: Number},
    kW: {type: Number},
    hours: {type: Number}
  }

  constructor() {
    super()
    this.gridPrice = 5
    this.taxPercent = 20
    this.selectPredefined(0)
  }

  selectPredefined(i) {
    this.kW = predefined[i].kW
    this.hours = predefined[i].h
  }

  static styles = css`
    input {
      width: 4em;
    }
    
    .field {
      margin-left: 1em;
    }
  `

  render = () => html`
    <select @input=${e => this.selectPredefined(e.target.selectedIndex)}>
      ${predefined.map(p => html`<option>${p.name}</option>`)}
    </select>
    <span class="field">
      <input type="number" .value=${this.kW} @input=${e => this.kW = e.target.value}> kW
    </span>
    <span class="field">
      <input type="number" .value=${this.hours} @input=${e => this.hours = e.target.value}> h
    </span>
    = <strong>${(this.kW * this.hours * (this.price + this.gridPrice) * (1 + this.taxPercent / 100) / 100).toFixed(2)} €</strong>

    <div style="margin-top: 2em">
      Grid price <input type="number" .value=${this.gridPrice} @input=${e => this.gridPrice = e.target.value}> cents/kWh -
      Tax <input type="number" .value=${this.taxPercent} @input=${e => this.taxPercent = e.target.value}> %
    </div>
  `
})

const predefined = [
  {name: 'Sauna', kW: 9, h: 3},
  {name: 'Heater', kW: 2.5, h: 8},
  {name: 'Nissan Leaf', kW: 3.3, h: 7.5},
  {name: 'Tesla Model 3', kW: 11, h: 5},
  {name: '100W light', kW: 0.1, h: 24}
]
