import https from 'https'

const json = 'application/json'

export function jsonRequest(url, res) {
  return new Promise((resolve, reject) => {
    let text = ''
    https.request(url, r =>
      r.on('data', chunk => text += chunk).on('end', () => {
        res.status(r.statusCode).header('Content-Type', json)
        resolve({statusCode: r.statusCode, text})
      })
    ).on('error', err => reject(err)).end()
  })
}
