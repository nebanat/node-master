const fileOps = require('../lib/data')
const helpers = require('../lib/helpers')

let UserService = {}

/**
 * @TODO - check and create directory
 * @description - creates a new user 
 * @param { obj } data - contains request data
 * @param { func } callback 
 */
UserService.post = async (data, callback) => {
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true  ? true : false

  if(firstName && lastName && phone && password && tosAgreement) {
    try {
        const hashedPassword = helpers.hash(password)
        const userObject = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          tosAgreement
        }
        const userCreation = await fileOps.create('users', phone, userObject)
        callback(200)
    }
    catch(err) {
        callback(400, {'Error':err })
    }
  }
  else {
    callback(400, {'Error': 'Missing some required fields'})
  }
}

/**
 * @description - retrieves a user with a specified phone
 * @param { obj } data - contains request details
 * @param { func } callback 
 */
UserService.get = async (data, callback) => {
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone.trim() : false

  if(phone) {
    try {
      const userData = await fileOps.read('users', phone)
      delete userData.hashedPassword
      callback(200, userData)
    }
    catch(err) {
      callback(400, { 'Error': err })
    }
  }
  else {
    callback(400, {'Error': 'Missing some required fields '})
  }


}

/**
 * @description - updates a user file or resource
 * @param { json } data - request data containing user details
 * @param { func } callback 
 */
UserService.put = async (data, callback) => {
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false

  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

  if(phone) {
    if(firstName || lastName || password) {
      try {
        const userData = await fileOps.read('users', phone)
        const hashedPassword = password ? helpers.hash(password) :userData.hashedPassword
        delete data.payload.password
        const newUserData = {...userData, ...data.payload, hashedPassword}
        const updatingFile = await fileOps.update('users', phone, newUserData)
        callback(200, newUserData)
      }
      catch(err) {
        callback(400, {'Error': err })

      }
    }
  }
  else {
    callback(400, {'Error': 'Missing required fields'})
  }
  
 
}
/**
 * @description - delete a user file or resource 
 * @param { json } data 
 * @param { func } callback 
 */
UserService.delete = async (data, callback) => {
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone.trim() : false

  if(phone) {
    try {
      const userDeletion = await fileOps.delete('users',phone)
      callback(200)
    }
    catch(err) {
      callback(500, {'Error': err })
    }
  }
  else {
    callback(400, {'Error': 'Missing required field'})
  }
 
  
}

module.exports = UserService