const UserService = require('../services/UserService')
const TokenService = require('../services/TokenService')

let handlers = {}
const acceptableMethods = ['post', 'get', 'put', 'delete']

/**
 * @description - creates handler for ping route
 * @param { json } data 
 * @param { func } callback 
 */
handlers.ping = (data, callback) => {
  callback(200, {'message': 'route pinged'})
}

/**
 * @description - creates handler for not found route
 * @param { json } data 
 * @param { func } callback 
 */
handlers.notFound = (data,callback) => {
  callback(404, {'Error': 'url requested in not found'})
}

/**
 * @description - creates handler for user resource
 * @param { json } data 
 * @param { func } callback 
 */
handlers.users = (data, callback) => {
  if(acceptableMethods.indexOf(data.method) > -1) {
    UserService[data.method](data, callback)
  }
  else {
    callback(405, {'Error': 'http method not allowed'})
  }

}

/**
 * @description - creates handler for token resource 
 * @param { json } data 
 * @param { func } callback 
 */
handlers.tokens = (data, callback) => {
  if(acceptableMethods.indexOf(data.method) > -1) {
    TokenService[data.method](data, callback)
  }
  else {
    callback(405, {'Error': 'http method not allowed'})
  }

}
module.exports = handlers
