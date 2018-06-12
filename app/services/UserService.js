const fileOps = require('../lib/data')
const helpers = require('../lib/helpers')
const userSchema = require('../schemas/userSchema')
const validate = require('validate.js')

let UserService = {}

/**
 * @description - creates a new user 
 * @param { obj } data - contains request data
 * @param { func } callback 
 */
UserService.post = async (data, callback) => {
  const { phone, password } = data.payload
  const validationError = validate(data.payload, userSchema.create)

  if(!validationError) {
    try {
        const hashedPassword = helpers.hashPass(password)
        delete data.payload.password
        const user = {...data.payload, hashedPassword }
        const userCreation = await fileOps.create('users', phone, user )
        delete user.hashedPassword
        callback(200, { user })
    }
    catch(err) {
        callback(400, {'Error':err })
    }

  }
  else {
    callback(400, {'error': validationError})
  }
}

/**
 * @description - retrieves a user with a specified phone
 * @param { obj } data - contains request details
 * @param { func } callback 
 */
UserService.get = async (data, callback) => {
  const { phone } = data.queryStringObject

  const validationError = validate( { phone } , userSchema.phoneValidation)

  if(!validationError) {
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
    callback(400, validationError)
  }
}

/**
 * @Todo - study process.nextTick to differ the deletion of new hashedpassword
 * @description - updates a user file or resource
 * @param { json } data - request data containing user details
 * @param { func } callback 
 */
UserService.put = async (data, callback) => {
  const { phone, firstName, lastName, password } = data.payload

  const validationError = validate(data.payload, userSchema.put)

  if(!validationError) {
    if(firstName || lastName || password) {
      try {
        const userData = await fileOps.read('users', phone)
        const hashedPassword = password ? helpers.hashPass(password) :userData.hashedPassword
        delete data.payload.password
        const newUserData = {...userData, ...data.payload, hashedPassword}
        const updatingFile = await fileOps.update('users', phone, newUserData)
      //   process.nextTick(() => {
      //     delete newUserData.hashedPassword
      //  })
        callback(201, { newUserData })
      }
      catch(err) {
        callback(400, {'Error': err })

      }
   }
    else {
      callback(400, {'Error': 'Please enter some fields to update'})
    }
  }
  else {
    callback(400, validationError)
  }
  
}
/**
 * @description - deletes a user resource
 * @param { obj } data 
 * @param { func } callback 
 */
UserService.delete = async (data, callback) => {
  const { phone } = data.queryStringObject

  const validationError = validate( { phone } , userSchema.phoneValidation)

  if(!validationError) {
    try {
      const userDeletion = await fileOps.delete('users',phone)
      callback(200, {'message': 'User successfully deleted'})
    }
    catch(err) {
      callback(500, {'Error': err })
    }
  }
  else {
    callback(400, validationError)
  }
}

module.exports = UserService