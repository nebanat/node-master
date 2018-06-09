const fs = require('fs')
const path = require('path')

const fileOps = {}

fileOps.baseDir = path.join(__dirname,'/../.data/')

/**
 * @description create a new file/resource or fail if file/resource already exist
 * @param { string } dir - directory for specified file/resource to be created in
 * @param { string } file - file/resource to be created
 */
fileOps.createORFail = (dir, file) => {
  return new Promise((resolve, reject) => {
    fs.open(`${fileOps.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
      if(!err && fileDescriptor) {
        resolve(fileDescriptor)
      }
      else {
        return reject('could not create file, it already exist')
      }
    })
  })
}

/**
 * @description opens a new file/resource or fail if file/resource does not exist
 * @param { string } dir - directory for specified file/resource
 * @param { string } file - file/resource to be opened
 */
fileOps.findORFail = (dir, file) => {
  return new Promise((resolve, reject) => {
    fs.open(`${fileOps.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
      if(!err && fileDescriptor) {
        resolve(fileDescriptor)
      }
      else {
        return reject('file specified does not exist')
      }
    })
  })
}

/**
 * @description - write to a file descriptor and closes the file
 * @param { descriptor } fileDescriptor - file to be written to
 * @param { json } data - data to be written to file  
 */
fileOps.writeToFile = (fileDescriptor, data) => {
  return new Promise((resolve, reject) => {
    const stringData = JSON.stringify(data)
    fs.writeFile(fileDescriptor, stringData, (err) => {
      if(!err) {
        fs.close(fileDescriptor, (err) => {
          if(!err) {
            resolve(true)
          }
          else {
            return reject('Error closing the file')
          }
        })
      }
      else {
        return reject('Error writing to file')
      }
    })
  })
}

/**
 * @description creates a new file/resource and writes to it
 * @param { string } dir - directory to create file/resource 
 * @param { string } file - file/resource to be created
 * @param { json } data - data to be written to file/resource
 */
fileOps.create = async (dir, file, data) => {
    try {
      const fileDescriptor = await fileOps.createORFail(dir, file)
      const fileWritting = await fileOps.writeToFile(fileDescriptor,data)
      return Promise.resolve(true)
    }
    catch(err) {
      return Promise.reject(err)
    }
}
/**
 * @description - reads a file/resource
 * @param { string } dir - containing directory of file to be resad
 * @param { string } file  - file to read from 
 */
fileOps.read = (dir, file) => {
  return new Promise((reject, resolve) => {
    fs.readFile(`${fileOps.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
      if(!err && data) {
        resolve(data)
      } 
      else {
        return reject(err)
      }
    })
  })
}
/**
 * @description - updates file or resource
 * @param { string } dir - containing directory for file
 * @param { string } file - file to update 
 * @param { json } data - data to update file with  
 */
fileOps.update = async (dir, file, data) => {
  try {
    const fileDescriptor = await fileOps.findORFail(dir, file)
    fs.truncate(fileDescriptor, async (err) => {
      if(!err) {
        const fileWriting = await fileOps.writeToFile(fileDescriptor, data)
        return Promise.resolve(true)
      }
      else {
        return Promise.reject('Unable to truncate file')
      }
    })
  }
  catch(err) {
    return Promise.reject(err)
    
  }
}

/**
 * @description - deletes a file/resource
 * @param {*} dir - directory containing file/resource to be deleted
 * @param {*} file - file/resource to be deleted
 */
fileOps.delete = (dir,file) => {
  return new Promise((resolve, reject) => {
    fs.unlink(`${fileOps.baseDir}${dir}/${file}.json`, (err) => {
      if(!err) {
        resolve(true)
      }
      else {
        return reject('file specified does not exist')
       }
    })
  })
}

module.exports = fileOps