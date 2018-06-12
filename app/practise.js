const validate = require('validate.js')
const userSchema = require('./schemas/userSchema')

const validateEmail = () => {
  const userObject = {
    firstName:'biliyok',
    lastName: '',
    phone: '',
    password: 'a'
  }
  const result = validate(userObject, userSchema.create)
  console.log(result)
}

validateEmail()