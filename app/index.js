const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const helpers = require('./lib/helpers')
const router = require('./router')
const handlers = require('./lib/handlers')
const config = require('./config')

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
  const { method, headers } = req
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
const server = http.createServer((req, res) => {
    unifiedServer(req, res)
})

server.listen(config.port, () => {
  console.log(`${config.envName} server listening on port ${config.port}`)
})
