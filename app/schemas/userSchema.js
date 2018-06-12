let userSchema = {}

/**
 * constraints for creating a user resource
 */
userSchema.create = {
  firstName: {
    presence: {
      allowEmpty: false
    },
    length:{
      minimum:2
    },
    numericality: false
  },

  lastName: {
    presence: {
      allowEmpty: false
    },
    length:{
      minimum:2
    },
    numericality: false
  },

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
  },
}

/**
 * constraints for deleting and getting a user resource
 */
userSchema.phoneValidation = {
  phone: {
    presence: true,
    format: {
      pattern: "^[0-9]{10}$",
      message: "Please phone number must be 10 digits"
    }
  }
}

/**
 * constraints for patching a user resource
 */
userSchema.put = {
  firstName: {
    length:{
      minimum:2
    },
    numericality: false
  },

  lastName: {
    length:{
      minimum:2
    },
    numericality: false
  },

  phone: {
    presence: true,
    format: {
      pattern: "^[0-9]{10}$",
      message: "Please phone number must be 10 digits"
    }
  },

  password: {
    length:{
      minimum:3
    }
  },

}

module.exports = userSchema
