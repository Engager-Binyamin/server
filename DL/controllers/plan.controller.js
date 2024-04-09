const planModel = require("../models/plan.model");

async function read(filter = {}) {
  return await planModel.find(filter);
}

async function readOne(filter = {}) {
  return await planModel.findOne(filter);
}

module.exports = {
  read,
  readOne,
};
