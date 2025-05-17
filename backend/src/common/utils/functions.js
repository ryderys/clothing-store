const path = require("path")
const fs = require("fs");
const { logger } = require("./logger");

function listOfImagesFromRequest(files, fileUploadPath) {
  if (!Array.isArray(files)) {
      throw new TypeError('Expected an array of files');
  }
  

  if (files.length > 0) {
      return files.map((file) => {
          if (!file || !file.filename) {
              console.error('Invalid file object:', file); // Debugging log
              throw new Error('File object is missing filename property');
          }
          const filePath = path.join(fileUploadPath, file.filename);
          return filePath.replace(/\\/g, '/');
      });
  } else {
      return [];
  }
}

function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", "0", 0, null, undefined]
  Object.keys(data).forEach(key => {
      if (blackListFields.includes(key)) delete data[key]
      if (typeof data[key] == "string") data[key] = data[key].trim();
      if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
      if (Array.isArray(data[key]) && data[key].length == 0) delete data[key]
      if (nullishData.includes(data[key])) delete data[key];
  })
}

function setFeatures(body) {
    const { colors, width, weight, height, length } = body;
    let features = {};
    features.colors = colors;
    if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
        if (!width) features.width = 0;
        else features.width = +width;
        if (!height) features.height = 0;
        else features.height = +height;
        if (!length) features.length = 0;
        else features.length = +length;
    }
    return features
}

function deleteFileInPublic(fileAddress) {
  if(!fileAddress){
    logger.error("No file address provided to deleteFileInPublic")
    return
  }
  const normalizedPath = path.normalize(fileAddress)
  const pathFile = path.join(__dirname, "..", "..", "public", normalizedPath);
  if (fs.existsSync(pathFile)) {
      try {
          fs.unlinkSync(pathFile);
          logger.info(`Successfully deleted file: ${pathFile}`)
      } catch (error) {
        logger.error(error)
        next(error)
          // Optionally rethrow the error or handle it as needed
      }
  } else {
    logger.warn(`File not found: ${pathFile}`)
  }
}
const removePropertyInObject = (target = {}, properties = []) => {
  // Check if target is a valid object
  if (typeof target !== 'object' || target === null) {
      throw new Error('Target must be a non-null object');
  }

  // Check if properties is a valid array
  if (!Array.isArray(properties)) {
      throw new Error('Properties must be an array of strings');
  }

  for (const property of properties) {
      if (target.hasOwnProperty(property)) {
          delete target[property];
      }
  }

  return target;
};

const stringToArray = (...fields) => (req, res, next) => {
  fields.forEach(field => {
    if (req.body[field]) {
      if (typeof req.body[field] === 'string') {
        req.body[field] = req.body[field]
          .split(/[#,\s]+/) // Split by #, , or any whitespace
          .filter(item => item) // Remove empty strings
          .map(item => item.trim()); // Trim whitespace from each item
      }
      if (Array.isArray(req.body[field])) {
        req.body[field] = [...new Set(req.body[field].map(item => item.trim()))]; // Trim and remove duplicates
      }
    } else {
      req.body[field] = [];
    }
  });
  next();
};
module.exports = {
    listOfImagesFromRequest,
    setFeatures,
    deleteFileInPublic,
    stringToArray,
    removePropertyInObject,
    deleteInvalidPropertyInObject
}