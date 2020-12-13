import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element'

customElements.define('price-card', class extends LitElement {
  static properties = {
    price: {}
  }

  static styles = css`
    h1 {
      text-align: center;
      padding: 0.5em 1em;
      margin: 0 0.3em;
      box-shadow: 1px 1px 10px rgba(0,0,0,0.3);
    }
    
    small {
      display: block;
      color: gray;
      font-size: 50%;
    }
  `

  render = () => html`
    <h1>
      ${this.price}
      <small>cents/kWh</small>
    </h1>
  `
})
