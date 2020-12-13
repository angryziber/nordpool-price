import countries from './countries.js'
import {LitElement, html} from './deps/lit-element.js'

customElements.define('country-select', class extends LitElement {
  static properties = {
    country: {}
  }

  render = () => html`
    <select>
      ${Object.keys(countries).map(code => html`
        <option ?selected=${this.country === code}>${code}</option>
      `)}
    </select>
  `
})
