let environment = {}

// define staging environment for application
environment.staging = {
  'httpPort': '', //port for http
  'httpsPort': '', //port for https
  'envName': 'staging',
  'hashingSecret': '' //hash secret for crypto hashing

}

// define staging environment for application
environment.production = {
  'httpPort': '', //port for http
  'httpsPort': '', //port for https
  'envName': 'production',
  'hashingSecret': '' //hash secret for crypto hashing

}

// get the current application environment
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : environment.staging

module.exports = environmentToExport