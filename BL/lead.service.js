const leadController = require('../DL/controllers/lead.controller');
const campaignController= require('../DL/controllers/campaign.controller')

async function addLeadToCamp(data){
    if(!data.campaign || !data.phone || !data.name) throw {code: 500, msg: 'User details are missing'};
    // TODO- check if phone is valid

    const phoneIsExist = await leadController.readOne({phone: data.phone});
    if(phoneIsExist?.campaigns?.includes(data.campaign)) throw {code: 500, msg: 'The lead is already registered for this campaign'}
    // TODO- אם הוא קיים אולי כן להחזיר לו גם אוביקט עם בנאדם
    let mappedLead = {};
    // אחרי בדיקות אפשר למחוק את המשתנה ורק להשאיר את הפעולה ב-אלז
    let lastId = '';
    if(phoneIsExist) {
        const idToUpdate = phoneIsExist._id;
        await leadController.update(idToUpdate, { $push: {campaigns: {_id: data.campaign}}});
        lastId = idToUpdate;
    } else {
        mappedLead = {
            phone : String(data.phone),
            name: String(data.name),
            campaigns: String(data.campaign),
            //  יש דרך יותר יפה? הדיפולט בסכמה לא עובד
            email: data.email? String(data.email): '',
            notes: data.notes? String(data.notes): '',
        }
        const createdLead = await leadController.create(mappedLead); 
        lastId = createdLead._id;
    }
    await campaignController.update({_id:data.campaign}, {$push: {leads: {lead: lastId}}});
    return {campaignId: data.campaign, lead: lastId}
}

async function updateLead(id, newData){
    if(Object.keys(newData).includes('phone')){
        const phoneIsExist = await leadController.readOne({phone: newData.phone});
        if(phoneIsExist) throw {code: 500, msg:'phoneExist' }
    }
    return leadController.update(id, newData)
}





// async function getAllSentMsgs({ id_: leadId }) {
//     const lead = await leadController.getOne({ _id: leadId })
//     const thisLeadCampaigns = lead.campaigns.map(camp => {
//         campaignController.getOne({ _id: camp.campaign })
//     })
//     console.log(lead);
//     console.log(thisLeadCampaigns);
//     // return lead
// }


 


module.exports = {addLeadToCamp, updateLead}