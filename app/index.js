const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const StringDecoder = require('string_decoder').StringDecoder
const helpers = require('./lib/helpers')
const router = require('./router')
const handlers = require('./lib/handlers')
const config = require('./config')

const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}
/**
 * @description return the URL path, trimmedPath and querystrings
 * @param {req} req 
 * @returns {obj} urlObject
 */
const getURLObject = (req) => {
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  const queryStringObject = parsedUrl.query

  return {
    path,
    trimmedPath,
    queryStringObject
  }

}

/**
 * @description handles request streaming
 * @param {req} req 
 * @param {res} res 
 */
const unifiedServer = (req, res) => {
  const urlObject = getURLObject(req)
  const method = req.method.toLowerCase()
  const headers = req.headers
  const decoder = new StringDecoder('utf-8')

  let buffer = ''

  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()

    const data = {
      ...urlObject, 
      method,
      headers, 
      'payload': helpers.parseJSONToObject(buffer)
    }

    const chosenHandler = typeof(router[urlObject.trimmedPath]) != 'undefined' ? router[urlObject.trimmedPath] : handlers.notFound

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200
      payload = typeof(payload) == 'object' ? payload : {}
      const payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type','application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })

  })

}

/**
 * Creates a http server instance
 */
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
})

/**
 * creates a https server instance
 */

 const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
   unifiedServer(req, res)
 })

httpServer.listen(config.httpPort, () => {
  console.log(`${config.envName} server listening on port ${config.httpPort}`)
})

httpsServer.listen(config.httpsPort, () => {
  console.log(`secured ${config.envName} server listening on port ${config.httpsPort}`)
})
