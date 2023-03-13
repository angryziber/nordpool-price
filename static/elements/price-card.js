import {BaseElement, html, css} from '../deps/element.js'

customElements.define('price-card', class extends BaseElement {
  static properties = {
    price: {},
    trend: {}
  }

  static styles = css`
    h1 {
      text-align: center;
      width: 5em;
      padding: 0.5em 0;
      margin: 0 0.3em;
      box-shadow: 1px 1px 10px rgba(0,0,0,0.3);
    }
    
    small {
      display: block;
      color: gray;
      font-size: 50%;
    }
    
    .up {color: darkred}
    .down {color: darkgreen}
  `

  render = () => html`
    <h1>
      ${this.price}${this.trend > 0 ? html`<span class="up">▲</span>` : this.trend < 0 ? html`<span class="down">▼</span>` : ''}
      <small>¢/kWh</small>
    </h1>
  `
})
