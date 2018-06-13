const helpers = require('./lib/helpers')

const id = 'tnxtrjbbxx2ez81eiie5'
const phone = '5557778956'

const userObject = {id, phone}

const stringData = JSON.stringify(userObject)

// console.log(helpers.parsedJSONToObject(stringData))
helpers.verifyToken(id, phone, (err, data) => {
  if(!err) {
    console.log(data)
  }
  else {
    console.error(err)
  }
})