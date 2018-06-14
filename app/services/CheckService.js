const validate = require('validate.js')
const checkSchema = require('../schemas/checkSchema')
const fileOps = require('../lib/data')
const helpers = require('../lib/helpers')
const config = require('../config')

let CheckService = {}

/**
 * @description - creates a new check for the user
 * @param { obj } data - holds request data object
 * @param { func } callback 
 */
CheckService.post = async (data, callback) => {
  const { token } = data.headers 
  const validationError = validate({...data.payload, token }, checkSchema.post)

  if(!validationError) {
    try {
      const tokenString = await fileOps.read('tokens', token)
      const tokenData = helpers.parsedJSONToObject(tokenString)
      const userString = await fileOps.read('users', tokenData.phone)
      const userData = helpers.parsedJSONToObject(userString)

      if(userData.checks.length < config.maxChecks) {
        const checkId = helpers.createRandomString(20);

        const checkObject = { ...data.payload, id: checkId, userPhone:tokenData.phone  }
        const checkCreated = await fileOps.create('checks', checkId, checkObject)
        userData.checks.push(checkId)
        const userUpdated = await fileOps.update('users', tokenData.phone, userData)
        callback(201, checkObject)
      }
      else  {
        callback(400, {'Error': `This user already has the maximum number of checks (${config.maxChecks})`})
      }
    }
    catch(err) {
      callback(500, {'Error': err})
    }
  }
  else {
    callback(400, validationError)
  }

}

/**
 * @description  - gets a check resource by Id
 * @param { obj } data - request data object  
 * @param { func } callback 
 */
CheckService.get = async (data, callback) => {
  const { id } = data.queryStringObject
  const { token } = data.headers
  const validationError = validate( { id, token } , checkSchema.get)

  if(!validationError) {
    try {
      const checkString = await fileOps.read('checks', id)
      const checkData = helpers.parsedJSONToObject(checkString)

      helpers.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
        if(tokenIsValid) {
          callback(200, { checkData })
        }
        else {
          callback(403, {'Error': 'Invalid or expired token. please provide a valid token'})
        }
      })
      
    }
    catch(err) {
      callback(400, { Error:err })

    }
  }
  else {
    callback(400, validationError)
  }

}

/**
 * @description - updates an existing check resource
 * @param { obj } data - request data object 
 * @param { func } callback 
 */
CheckService.put = async (data, callback) => {
  const { id, url, method, successCodes, timeout } = data.payload
  const { token } = data.headers
  const validationError = validate({...data.payload, token}, checkSchema.put)

  if(!validationError) {
    if(url || method || successCodes || timeout) {
      try {
        const checkString = await fileOps.read('checks', id)
        const checkData = helpers.parsedJSONToObject(checkString)
        helpers.verifyToken(token, checkData.userPhone, async (tokenIsValid) => {
          if(tokenIsValid) {
            delete data.payload.id
            const newCheckData = {...checkData, ...data.payload }
            const updatingFile = await fileOps.update('checks', id,  newCheckData)
            callback(200, newCheckData)
          }
          else {
            callback(403, {Error: 'Invalid token or token has expired'})
          }
        })
       
      }
      catch(err) {
        callback(500, { Error: err })
      }
   }
    else {
      callback(400, {'Error': 'missing fields to update'})
    }
  }
  else {
    callback(400, validationError)
  }

}

/**
 * @description - delete a check service resource
 * @param { obj } data  - request data object
 * @param { func } callback 
 */
CheckService.delete = async (data, callback) => {
  const { id } = data.queryStringObject
  const { token } = data.headers
  const validationError = validate( { id, token } , checkSchema.get)

  if(!validationError) {
    try {
      const checkString = await fileOps.read('checks', id)
      const checkData = helpers.parsedJSONToObject(checkString)
      helpers.verifyToken(token, checkData.userPhone, async (tokenIsValid) => {
        if(tokenIsValid) {
          const deletingCheck = fileOps.delete('checks', id)
          const userString = await fileOps.read('users', checkData.userPhone)
          const userData = helpers.parsedJSONToObject(userString)
          //remove the checks from the user checks and update user data in the user directory
          const checkIndex = userData.checks.indexOf(id)
          userData.checks.splice(checkIndex, 1)
          const updatingUserChecks = await fileOps.update('users', checkData.userPhone, userData)

          callback(200, {'message': 'check successfully deleted'})

        }
        else {
          callback(403, {Error:'Invalid token or token provided has expired'})
        }

      })
    }
    catch(err) {
      callback(500, {Error: err})
    }
  }
  else {
    callback(400, validationError)
  }

}

module.exports = CheckService