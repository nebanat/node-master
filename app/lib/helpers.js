const crypto = require('crypto') 
const config = require('../config')
const fileOps = require('./data')

let helpers = {}


helpers.hashPass = (str) => {
  if(typeof(str) == 'string' && str.length > 0) {
    const hashStr = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    return hashStr
  }
  else  {
    return false
  }
}


helpers.createRandomString = (strLength) => {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false
  if(strLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'

    let randomStr = ''

    for(i = 1; i <= strLength; i++) {
      let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
      randomStr += randomCharacter
    }

    return randomStr
  }
  else {
    return false
  }
}

helpers.parsedJSONToObject = (str) => {
  try {
    const obj = JSON.parse(str)
    return obj
  }
  catch(e) {
    return {}
  }
}

helpers.verifyToken = async (id, phone, callback) => {
  try {
    const stringData = await fileOps.read('tokens', id)
    const tokenData = helpers.parsedJSONToObject(stringData)
    if(tokenData.phone == phone && tokenData.expiresIn > Date.now()) {
      callback(true)
    }
    else {
      callback(false)
    }
  }
  catch (err) {
    console.log(err)
    callback(false)
  }
}

module.exports = helpers
