import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element@2.4.0?min'
import {closeTags} from './closeTags.js'
import commonStyles from '../css/common.js'

function htmlWithSelfClosingTags(strings, ...values) {
  return html(closeTags(strings), ...values)
}

function cssWithCommonStyles(strings, ...values) {
  strings = [...strings]
  strings[0] = commonStyles + strings[0]
  return css(strings, ...values)
}

export {LitElement, htmlWithSelfClosingTags as html, cssWithCommonStyles as css}
