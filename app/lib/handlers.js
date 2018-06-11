const UserService = require('../services/UserService')

let handlers = {}
const acceptableMethods = ['post', 'get', 'put', 'delete']

handlers.ping = (data, callback) => {
  callback(200, {'message': 'route pinged'})
}

handlers.notFound = (data,callback) => {
  callback(404, {'Error': 'url requested in not found'})
}

handlers.users = (data, callback) => {
  if(acceptableMethods.indexOf(data.method) > -1) {
    UserService[data.method](data, callback)
  }
  else {
    callback(405, {'Error': 'http method not allowed'})
  }

}
module.exports = handlers
