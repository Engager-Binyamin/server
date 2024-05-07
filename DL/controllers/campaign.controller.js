const campaignModel = require('../models/campaign.model');

// 
async function read(filter, select = "") {
    return await campaignModel.find(filter).select(select)
}

//
async function readOne(filter = {}) {
    return await campaignModel.findOne(filter)
}

//
async function create(data) {
    return await campaignModel.create(data)
}

//
async function update(filter = {}, update) {
    return await campaignModel.findByIdAndUpdate(filter, update, { new: true })
}

//not in use
async function readOneWithoutPopulate(filter, populate) {
    return await campaignModel.findOne(filter).populate(populate)
}
function deleteById(id) {
    return campaignModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
}

async function updateOne(filter = {}, update) {
    return await campaignModel.updateOne(filter, update, { new: true })
}



module.exports = {
    read,
    readOne,
    create,
    update,
    deleteById,
    updateOne,
    readOneWithoutPopulate
}
