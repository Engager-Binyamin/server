const { MongoClient, ObjectId } = require('mongodb');

// Function to validate ObjectId
function isValidObjectId(id) {
    try {
      new ObjectId(id);
      return true;
    } catch (error) {
      return false;
    }
  }

module.exports =  {isValidObjectId}