let handlers = {}

handlers.ping = (data, callback) => {
  callback(200, {'message': 'route pinged'})
}

handlers.notFound = (data,callback) => {
  callback(404, {'Error': 'url requested in not found'})
}

module.exports = handlers
