const {  ObjectId } = require('mongodb');

// Function to validate ObjectId
function isValidObjectId(id) {
    return ObjectId.isValid(id)
  }

module.exports =  {isValidObjectId}