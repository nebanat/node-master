const crypto = require('crypto') 
const config = require('../config')

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

helpers.parseJSONToObject = (str) => {9
  try {
    const obj = JSON.parse(str)
    return obj
  }
  catch(e) {
    return {}
  }
}


module.exports = helpers
