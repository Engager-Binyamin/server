const leadController = require("../DL/controllers/lead.controller");
const campaignController = require("../DL/controllers/campaign.controller");
const campaignService = require('./campaign.service');
const userController = require('../DL/controllers/user.controller')
const userModel = require('../DL/models/user.model')
const { isValidObjectId } = require('../utilities/helper')

// ADD A NEW LEAD TO A CAMP
async function addLeadToCamp(campaignId, userId, data, token = false) {
  if (!data.phone || !data.fullName) throw { code: 400, msg: "User details are missing" };

  const campaign = await campaignController.readOne({ user: userId, _id: campaignId });
  if (!campaign) throw { code: 404, msg: "Campaign not found" };

  // Check if the lead is already registered for this campaign
  const phoneIsExist = campaign.leads.some((lead) => lead.phone === data.phone);
  if (phoneIsExist) throw ({ code: 400, msg: "The lead is already registered for this campaign" });

  let extra = {}
  for (e in data) {
    if (e.startsWith('ex_')) {
      let ks = e.split('ex_')[1]
      if (ks.endsWith('_he')) {
        let ke = ks.split('_he')[0]
        if (!extra[ke]) extra[ke] = {}
        extra[ke].he = data[e]
        continue
      }
      if (!extra[ks]) extra[ks] = {}
      extra[ks].value = data[e]
    }
  }

  Object.keys(extra).forEach(k => {
    if (!campaign.fields.some(f => f.en == k)) {
      campaign.fields.push({ en: k, he: extra[k].he })
    }
  })

  let mappedLead = {
    phone: data.phone,
    fullName: data.fullName,
    email: data.email,
    notes: data.notes,
    extra
  }
  campaign.leads.push(mappedLead);
  await campaign.save();

  return mappedLead;
}


// TO UPDATE ONE LEAD IN A CAMP
async function updateLeadInCamp(campId, leadId, newData) {
  const campaign = await campaignController.readOne({ _id: campId });
  if (!campaign) throw { code: 500, msg: "phoneExist" };
  const leadIndex = campaign.leads.findIndex(
    (lead) => lead._id.toString() === leadId
  );
  if (leadIndex === -1) throw { code: 404, msg: "lead not found" };

  let filter = { _id: campId, "leads._id": leadId };

  let update = {
    $set: {},
  };

  newData.fullName && (update.$set[`leads.${leadIndex}.fullName`] = newData.fullName);
  newData.email && (update.$set[`leads.${leadIndex}.email`] = newData.email);
  newData.notes && (update.$set[`leads.${leadIndex}.notes`] = newData.notes);
  newData.phone && (update.$set[`leads.${leadIndex}.phone`] = newData.phone);

  // Update extra fields
  if (newData.extra) {
    const existingExtra = campaign.leads[leadIndex].extra || {};
    const updatedExtra = { ...existingExtra, ...newData.extra };
    update.$set[`leads.${leadIndex}.extra`] = updatedExtra;
  }

  return await campaignController.update(filter, update);
}
// TO DELETE LEAD FROM A SINGEL CAMP
async function delLeadFromCamp(campId, leadId) {
  const campaign = await campaignController.readOne({ _id: campId });
  if (!campaign) throw { code: 404, msg: "No campaign found" };
  const lead = campaign.leads.find((lead) => lead._id.toString() === leadId);
  if (!lead) throw { code: 404, msg: "No lead found" };
  lead.isActive = false;
  await campaign.save();
  return lead;
}

async function deleteLeadFromAllCamp(userId, leadPhone) {
  try {
    if (!isValidObjectId(userId)) throw { code: 401, msg: "Invalid userId" };
    let lead = await leadController.readOne(leadPhone)
    if (!lead) return "lead doesnt exist"

    const userCheck = await userController.readOne({ _id: userId }, '', '');
    if (!userCheck) return "user doesnt exist"

    let campaigns = await campaignController.read({ user: userId, "leads.phone": leadPhone });

    campaigns = campaigns.map(campaign => {
      const leadIndex = campaign.leads.findIndex(lead => lead.phone.toString() === leadPhone);
      if (leadIndex !== -1) {
        campaign.leads[leadIndex].isActive = !campaign.leads[leadIndex].isActive;
        // campaign.leads[leadIndex].isActive = false
      }
      return campaign;
    });
    campaigns = await Promise.all(campaigns.map(campaign => campaign.save()));

    return campaigns;
  } catch (error) {
    console.error("Error deleting lead from all campaigns:", error);
    throw error;
  }
}

// // TODO: get LeadS From All Camps
// async function getLeadFromAllCamps(leadId) {
//   try {
//   } catch (error) {
//     console.error("Error fetching lead from all camps:", error);
//     throw error;
//   }
// }

module.exports = {
  updateLeadInCamp,
  addLeadToCamp,
  delLeadFromCamp,
  deleteLeadFromAllCamp,
};
