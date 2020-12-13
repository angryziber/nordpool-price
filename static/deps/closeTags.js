export function closeTags(strings) {
  let tagName
  return strings.map(part => {
    const hasEnd = part.indexOf('/>') >= 0
    if (tagName && hasEnd)
      part = part.replace(/^([^<]*?)\/>/, '$1></' + tagName + '>')
    if (!tagName || hasEnd)
      tagName = part.match(/<([^ >]+)[^>]*?$/)?.[1]
    return part
  })
}
