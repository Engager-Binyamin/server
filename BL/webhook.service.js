const jwt = require('jsonwebtoken')
const campaignController = require('../DL/controllers/campaign.controller')
const leadService = require('../BL/lead.service')
// יצירת טוקן
const createToken = async (campaignId) => {
    const campaign = await campaignController.read({ _id: campaignId })
    if (!campaign) throw { msg: 'campaign not found' }
    let token = jwt.sign({ campaignId }, process.env.JWT_SECRET)
    return token
}

// בדיקת טוקן 
const checkToken = async (token) => {
    try {
        const approval = jwt.verify(token, process.env.JWT_SECRET)
        if (!approval) throw { msg: 'token is not valid' }
        const campaign = await campaignController.read({ _id: approval.campaignId })
        if (!campaign) throw { msg: 'campaign not found' }
        return approval.campaignId
    } catch (error) {
        return error
    }

}


// שליחה להוספת לייד
const sendToAddLead = async (token, data) => {
    let campaignId = await checkToken(token)
    data.campaign = campaignId
    return 'the lede create' +  await leadService.addLeadToCamp(data)
}
module.exports = { createToken, sendToAddLead }