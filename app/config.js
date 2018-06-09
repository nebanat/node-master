let environment = {}

environment.staging = {
  'port': 3000,
  'envName': 'staging',
  'hashingSecret': 'thisIsASecret'

}

environment.production = {
  'port': 5000,
  'envName': 'production',
  'hashingSecret': 'thisIsASecret'

}

// get the current application environment
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : environment.staging

module.exports = environmentToExport