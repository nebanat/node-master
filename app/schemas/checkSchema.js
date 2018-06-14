let checkSchema = {}

checkSchema.post = {
  url: {
    presence: {
      allowEmpty: false
    },
    url: true
  },

  method: {
    presence: {
      allowEmpty: false
    },
    inclusion:['get','post','put', 'delete']
  },

  successCodes: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 99,
      lessThanOrEqualTo: 530
    }
  },
  
  timeout: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    },
  },

  token: {
    presence: {
      allowEmpty: false
    },
    format: {
      pattern: "^[a-z0-9]{20}$",
      message: "Invalid token. provide a valid token"
    }
  }

}

checkSchema.get = {
  id: {
    presence: {
      allowEmpty: false
    },
    format: {
      pattern: "^[a-z0-9]{20}$",
      message: "check id must be 20 characters"
    }
  },
  token: {
    presence: {
      allowEmpty: false
    },
    format: {
      pattern: "^[a-z0-9]{20}$",
      message: "Invalid token. provide a valid token"
    }
  }

}

checkSchema.put =  {
  id: {
    presence: true,
    format: {
      pattern: "^[a-z0-9]{20}$",
      message: "check id must be 20 characters"
    }
  },
  token: {
    presence: {
      allowEmpty: true
    },
    format: {
      pattern: "^[a-z0-9]{20}$",
      message: "Invalid token. provide a valid token"
    }
  },
  url: {
    url: true
  },

  method: {
    inclusion:['get','post','put', 'delete']
  },

  successCodes: {
    numericality: {
      onlyInteger: true,
      greaterThan: 99,
      lessThanOrEqualTo: 530
    }
  },
  
  timeout: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    },
  },


}

module.exports = checkSchema