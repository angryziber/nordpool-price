import {LitElement, html, css} from './lit-element.js'
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

export {LitElement as BaseElement, htmlWithSelfClosingTags as html, cssWithCommonStyles as css}
