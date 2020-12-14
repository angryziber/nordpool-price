import countries from './countries.js'
import {BaseElement, html, css} from './deps/element.js'

customElements.define('country-select', class extends BaseElement {
  static properties = {
    country: {}
  }

  static styles = css`
    select {
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
