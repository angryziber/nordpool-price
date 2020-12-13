import countries from './countries.js'
import {LitElement, html, css} from './deps/lit-element.js'

customElements.define('country-select', class extends LitElement {
  static properties = {
    country: {}
  }

  static styles = css`
    select {
      font-size: 100%;
      font-weight: bold;
    }
  `

  render = () => html`
    <select>
      ${Object.keys(countries).map(code => html`
        <option ?selected=${this.country === code}>${code}</option>
      `)}
    </select>
  `
})
