const campaignModel = require('../models/campaign.model')


const create = async (campId, data) => { }

const update = async (campId, filter, newData) => {

}

const read = async (campId, filter) => { }



const readOne = async (leadPhone) => {
    try { 
        const lead = await campaignModel.findOne({ 'leads.phone': leadPhone });
        return lead;
    } catch (error) {
        console.error("Error reading lead:", error);
        throw error;
    }
}

module.exports = { create, update, read, readOne }