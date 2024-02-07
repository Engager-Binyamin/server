const campaignModel = require('../models/campaign.model');


async function create(data) {
    return await campaignModel.create(data)
}

async function read(filter,select="") {
    return await campaignModel.find(filter).select(select)
}


async function readOne(filter, populate) {
    populate = 'leads.lead'
    return await campaignModel.findOne(filter).populate(populate)
}
async function readOneWithoutPopulate(filter, populate) {
    return await campaignModel.findOne(filter).populate(populate)
}

async function update(filter = {}, update) {
    return await campaignModel.findByIdAndUpdate(filter, update)
}

function deleteById(id) {
    return campaignModel.findByIdAndUpdate(id, { isActive: false })
}

async function updateOne(filter = {}, update){
    return await campaignModel.updateOne(filter, update)

}

module.exports = { create, read, readOne, update, deleteById, updateOne, readOneWithoutPopulate }
