const handlers = require('./lib/handlers')

const router = {
  'ping': handlers.ping,
  'notFound': handlers.notFound,
  'users': handlers.users,
  'tokens': handlers.tokens
}

module.exports = router
