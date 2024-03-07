const leadController = require("../DL/controllers/lead.controller");
const campaignController = require("../DL/controllers/campaign.controller");

async function addLeadToCamp(campId, data) {
  console.log("datainser", data);
  if (!data.phone || !data.fName)
    throw { code: 500, msg: "User details are missing" };
  // TODO- check if phone is valid

  const campaign = await campaignController.readOne({_id : campId});
  console.log("campin",campaign , campId);
  if (!campaign) throw {  code: 404, msg: "Campaign not found"};

  const phoneIsExist = await campaign.leads.some((lead) => lead.phone === data.phone);
  if (phoneIsExist)
    throw {
      code: 500,
      msg: "The lead is already registered for this campaign",
    };
  // Check if the lead is already registered for this campaign
  let mappedLead = {};

  mappedLead = {
    phone: String(data.phone),
    lName: String(data.lName),
    fName: String(data.fName),
    //  יש דרך יותר יפה? הדיפולט בסכמה לא עובד
    email: data.email ? String(data.email) : "",
    notes: data.notes ? String(data.notes) : "",
  };
  campaign.leads.push(mappedLead);
  await campaign.save();

  return mappedLead;
}

async function updateLeadInCamp(campId,leadId, newData) {
    const campaign = await campaignController.readOne({_id:campId}) 
       if (!campaign) throw { code: 500, msg: "phoneExist" };
       const leadIndex = campaign.leads.findIndex((lead)=> lead._id.toString() ===leadId)
       if (leadIndex === -1 ) throw { code: 404, msg: "lead not found" }

       let filter = { _id: campId, "leads._id": leadId };

       let update = {
        $set: {},
      };
      newData.fName && (update.$set[`leads.${leadIndex}.fName`]=newData.fName) 
      newData.lName && (update.$set[`leads.${leadIndex}.lName`]=newData.lName) 
      newData.email &&( update.$set[`leads.${leadIndex}.email`]=newData.email) 
      newData.notes &&( update.$set[`leads.${leadIndex}.notes`]=newData.notes )
      newData.phone && (update.$set[`leads.${leadIndex}.phone`]=newData.phone )

  
  return  await campaignController.update(filter, update);
}

async function delLeadFromCamp(capId, leadId) {
  if (!capId) throw { code: 404, msg: "No campaign found" };
  if (!leadId) throw { code: 404, msg: "No lead found" };
  const updateIsActiv = await campaignController.updateOne(
    { _id: capId, "leads": leadId },
    { $set: { "leads.$.isActive": false } }
  );

  return updateIsActiv;
}

// TODO: delete Lead From All Camp
async function deleteLeadFromAllCamp( leadId) {

}
// TODO: get LeadS From All Camps
async function getLeadFromAllCamps(){

}




module.exports = { updateLeadInCamp, getLeadFromAllCamps,addLeadToCamp, delLeadFromCamp ,deleteLeadFromAllCamp};
