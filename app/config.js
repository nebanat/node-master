let environment = {}

environment.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging',
  'hashingSecret': 'thisIsASecret',
  'maxChecks': 5

}

environment.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production',
  'hashingSecret': 'thisIsASecret',
  'maxChecks': 5

}

// get the current application environment
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : environment.staging

module.exports = environmentToExport