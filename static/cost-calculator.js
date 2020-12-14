import {LitElement, html, css} from './deps/lit-element.js'

customElements.define('cost-calculator', class extends LitElement {
  static properties = {
    price: {type: Number},
    kW: {attribute: false},
    hours: {attribute: false}
  }

  constructor() {
    super()
    this.kW = 9
    this.hours = 3
  }

  static styles = css`
    input {
      margin-left: 1em;
      width: 4em;
    }
  `

  render = () => html`
    <select><option>Sauna</option></select>
    <input type="number" .value=${this.kW} @input=${e => this.kW = e.target.value}> kW
    <input type="number" .value=${this.hours} @input=${e => this.hours = e.target.value}> h
    = <span>${(this.kW * this.hours * this.price / 100).toFixed(2)} €</span>
  `
})
