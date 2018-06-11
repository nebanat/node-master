const crypto = require('crypto') 
const config = require('../config')
const fileOps = require('./data')

let helpers = {}

helpers.hash = (str) => {
  if(typeof(str) == 'string' && str.length > 0) {
    const hashStr = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    return hashStr
  }
  else  {
    return false
  }
}

helpers.parseJSONToObject = (str) => {
  try {
    const obj = JSON.parse(str)
    return obj
  }
  catch(e) {
    return {}
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

module.exports = helpers
