let helpers = {}

helpers.parseJSONToObject = (str) => {
  try {
    const obj = JSON.parse(str)
    return obj
  }
  catch(e) {
    return {}
  }
}

module.exports = helpers
