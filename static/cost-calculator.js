import {LitElement, html, css} from './deps/lit-element.js'

customElements.define('cost-calculator', class extends LitElement {
  static properties = {
    price: {type: Number},
    kW: {attribute: false},
    hours: {attribute: false}
  }

  constructor() {
    super()
    this.selectPredefined(0)
  }

  selectPredefined(i) {
    this.kW = predefined[i].kW
    this.hours = predefined[i].h
  }

  static styles = css`
    input {
      margin-left: 1em;
      width: 4em;
    }
  `

  render = () => html`
    <select @input=${e => this.selectPredefined(e.target.selectedIndex)}>
      ${predefined.map(p => html`<option>${p.name}</option>`)}
    </select>
    <input type="number" .value=${this.kW} @input=${e => this.kW = e.target.value}> kW
    <input type="number" .value=${this.hours} @input=${e => this.hours = e.target.value}> h
    = <span>${(this.kW * this.hours * this.price / 100).toFixed(2)} €</span>
  `
})

const predefined = [
  {name: 'Sauna', kW: 9, h: 3},
  {name: 'Heater', kW: 2.5, h: 8},
  {name: 'Nissan Leaf', kW: 3.3, h: 7.5},
  {name: 'Tesla Model 3', kW: 11, h: 5},
  {name: '100W light', kW: 0.1, h: 24}
]
