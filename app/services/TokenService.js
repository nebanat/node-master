const validate = require('validate.js')
const fileOps = require('../lib/data')
const helpers = require('../lib/helpers')
const tokenSchema = require('../schemas/tokenSchema')

let TokenService = {}

/**
 * @description - logs a user in and creates a token
 * @param { json } data 
 * @param { func } callback 
 */
TokenService.post = async (data, callback) => {
  const { phone, password } = data.payload
  const validationErrors = validate(data.payload, tokenSchema.create)
  if(!validationErrors) {
    try {
        const stringData  = await fileOps.read('users', phone)
        const userData = helpers.parsedJSONToObject(stringData)
        const hashedPassword = helpers.hashPass(password)

        if(hashedPassword == userData.hashedPassword) {
          const tokenId = helpers.createRandomString(20)
          const expiresIn = Date.now() + 1000 * 60 * 60
          const tokenObject = {
            phone,
            expiresIn,
            'id': tokenId
          }
          const saveToken = await fileOps.create('tokens', tokenId, tokenObject)
          callback(201, { tokenObject })

        }
        else {
          callback(400, {'Error': 'Password does not match for this user'})
        }

    }
    catch(err) {
        callback(500, { Error: err })
    }
  }
  else {
    callback(400, validationErrors)
  }
}

/**
 * @description - get a token resource
 * @param { obj } data - holds the request data object 
 * @param { func } callback 
 */
TokenService.get = async (data, callback) => {
  const validationErrors = validate(data.queryStringObject, tokenSchema.constraint)
  const { id } = data.queryStringObject

  if(!validationErrors) {
    try {
      const tokenData = await fileOps.read('tokens', id)
      callback(200, tokenData)
    }
    catch(err) {
      callback(500, {'Error': err })
    }
  }
  else {
    callback(400, validationErrors)
  }
}

/**
 * @description - PUT: extends the duration of a token
 * @param { obj } data 
 * @param { func } callback 
 */
TokenService.put = async (data, callback) => {
  const validationErrors = validate(data.payload, tokenSchema.constraint)
  const { id } = data.payload
  if(!validationErrors) {
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
    callback(400, validationErrors)
  }
}
/**
 * @description - DELETE a token resource
 * @param { obj } data 
 * @param { func } callback 
 */
TokenService.delete = async (data, callback) => {
  const validationErrors = validate(data.queryStringObject, tokenSchema.constraint)
  const { id } = data.queryStringObject
  if(!validationErrors) {
    try {
      const tokenDeletion = await fileOps.delete('tokens', id)
      callback(200, {'message': 'token succesfully deleted'})
    }
    catch(err) {
      callback(500, err)
    }
  }
  else {
    callback(400, validationErrors)
  }
}

module.exports = TokenService
