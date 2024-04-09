const userModel = require('../models/user.model');

async function create(data) {
    return await userModel.create(data);
}


async function read(filter = {}) {
    return await userModel.find(filter);
}

async function readAllWithPopulate(filter, select, populate) {
    return await userModel.find(filter).select(select).populate(populate)
}

async function readOne(filter, select, populate) {
    return await userModel.findOne(filter).select(select).populate(populate)
}

async function update(filter, data) {
    return await userModel.updateOne(filter, data, { new: true })
}

async function updateOne(filter, data) {
    return await userModel.updateOne(filter, data, { new: true })
}

async function updateUser(query, data) {
    return await userModel.updateOne(query, { $set: data }, { upsert: true });
}

module.exports = { create, read, readOne, update, updateOne, updateUser, readAllWithPopulate }