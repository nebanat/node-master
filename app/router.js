const handlers = require('./lib/handlers')

const router = {
  'ping': handlers.ping,
  'notFound': handlers.notFound
}

module.exports = router
