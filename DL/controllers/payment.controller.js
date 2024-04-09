const paymentModel = require("../models/payment.model");

async function read(filter = {}) {
  return await paymentModel.find(filter);
}

async function readOne(filter = {},populate="") {
    
  return await paymentModel.findOne(filter).populate();
}

async function create(data) {
    return await paymentModel.create(data);
  }
module.exports = {
  read,
  readOne,
  create
};