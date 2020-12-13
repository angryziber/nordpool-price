import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element@2.4.0?min'

function htmlWithSelfClosingTags(strings, ...values) {
  let tagName
  strings = strings.map(part => {
    const hasEnd = part.indexOf('/>') >= 0
    if (tagName && hasEnd)
      part = part.replace(/^([^<]*?)\/>/, '$1></' + tagName + '>')
    if (!tagName || hasEnd)
      tagName = part.match(/<([^ >]+)[^>]*?$/)?.[1]
    return part
  })
  return html(strings, ...values)
}

export {LitElement, htmlWithSelfClosingTags as html, css}
