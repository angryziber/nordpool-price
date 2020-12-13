import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element@2.4.0?min'
import {closeTags} from "./closeTags.js";

function htmlWithSelfClosingTags(strings, ...values) {
  return html(closeTags(strings), ...values)
}

export {LitElement, htmlWithSelfClosingTags as html, css}
