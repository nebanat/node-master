const handlers = require('./handlers')

const router = {
  'ping': handlers.ping,
  'notFound': handlers.notFound
}

module.exports = router
