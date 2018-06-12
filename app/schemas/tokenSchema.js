let tokenSchema = {}

tokenSchema.create = {
  phone: {
    presence: true,
    format: {
      pattern: "^[0-9]{10}$",
      message: "Please phone number must be 10 digits"
    }
  },
  password: {
    presence: {
      allowEmpty: false
    },
    length:{
      minimum:3
    }
  }
}

tokenSchema.constraint  = {
  id: {
    presence: {
      allowEmpty: false
    },
    length:{
      minimum: 20
    },
    format: {
      pattern: "^[a-z0-9]{20}$",
      message: "token Id cannot contain special characters or spaces"
    }
  }
}

module.exports = tokenSchema