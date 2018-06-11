const fileOps = require('../lib/data')
const helpers = require('../lib/helpers')

let TokenService = {}

/**
 * @description - logs a user in and creates a token
 * @param { json } data 
 * @param { func } callback 
 */
TokenService.post = async (data, callback) => {
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

  if(phone && password) {
    try {
      const userData  = await fileOps.read('users', phone)
      const hashedPassword = helpers.hash(password)

      if(hashedPassword == userData.hashedPassword){
        const tokenId = helpers.createRandomString(20)
        const expiresIn = Date.now() + 1000 * 60 * 60
        const tokenObject = {
          phone,
          expiresIn,
          'id': tokenId
        }
        const saveToken = await fileOps.create('tokens', tokenId, tokenObject)
        callback(200, { tokenObject })

      }
      else {
        callback(400, {'Error': 'Password does not match for this user'})
      }
    }
    catch(err){
      callback(500,{'Error': err })
    }
  }
  else {
    callback(400, {'Error': 'missing required fields'})
  }
}

/**
 * @description - get a token resource
 * @param { obj } data - holds the request data object 
 * @param { func } callback 
 */
TokenService.get = async (data, callback) => {
  const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false
  if(id) {
    try {
      const tokenData = await fileOps.read('tokens', id)
      callback(200, tokenData)
    }
    catch(err) {
      callback(500, {'Error': err })
    }
  }
  else {
    callback(400, {'Error': 'Missing required '})
  }
  
}

/**
 * @description - PUT: extends the duration of a token
 * @param { obj } data 
 * @param { func } callback 
 */
TokenService.put = async (data, callback) => {
  const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false
  const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false

  if(id && extend) {
      try {
        const tokenData = await fileOps.read('tokens', id)
        
        if(tokenData.expiresIn > Date.now()) {
            tokenData.expiresIn = Date.now() + 1000 * 60 * 60
            const updateToken = await fileOps.update('tokens', id, tokenData)
            callback(200, {'message': 'token updated successfully'})
          }
        else {
          callback(400, {'Error': 'Token has expired and cannot be extended'})
        }

      }
      catch(err) {
        callback(500, {'Error':err })
      }
    }
  else {
    callback(400, {'Error': 'Missing some required fields'})
  }
}
/**
 * @description - DELETE a token resource
 * @param { obj } data 
 * @param { func } callback 
 */
TokenService.delete = async (data, callback) => {
  const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false

  if(id) {
    try {
      const tokenDeletion = await fileOps.delete('tokens', id)
      callback(200, tokenDeletion)
    }
    catch(err) {
      callback(500, err)
    }
  }
  else {
    callback(400, {'Error': 'Missing required fields'})
  }
  
}

module.exports = TokenService
