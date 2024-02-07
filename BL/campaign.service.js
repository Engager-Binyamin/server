const campaignController = require("../DL/controllers/campaign.controller");
const userController = require("../DL/controllers/user.controller")
const { io } = require("socket.io-client");
const socket1 = io("http://localhost:3000");
const { isValidObjectId } = require('./functions')

async function createNewCampaign(userId, campName, starterMsg) {
  // console.log(userId, campName);
  if (!isValidObjectId(userId)) throw { code: 401, msg: "inValid _id" };
  campName = campName.trim();
  const nameIsExist = await campaignController.readOne({
    user: userId,
    title: campName,
  });
  if (nameIsExist) throw { code: 404, msg: "This name already exists" };
  const created = await campaignController.create({
    user: userId,
    title: campName,
    starterMsg: starterMsg,
  });
  const updatedUser = await userController.updateOneByFilter({ _id: userId }, { $push: { campaigns: created._id } });
  if (updatedUser) console.log('update user', updatedUser);
  return created;
}

async function getAllCampaignsByUser(userId) {
  // do not touch!!!!
  if (!isValidObjectId(userId)) throw { code: 401, msg: "inValid _id" };
  const campaigns = await campaignController.read({ user: userId });
  // if (!campaigns.length) throw { code: 404, msg: "no campaigns for this user" };
  return campaigns;
}
async function delCampaign(campId) {
  if (!isValidObjectId(campId)) throw { code: 401, msg: "inValid _id" };
  const campaign = campaignController.readOne({ _id: campId });
  if (!campaign) throw { code: 404, msg: "Campaign is not exist!" };
  return await campaignController.update({ _id: campId }, { isActive: false })
}
async function delOneMessage(campId, msgId) {

  const message = await getOneMsg(campId, msgId)
  console.log("message: ", message);
  console.log("message: ", message);
  if (!message) throw { code: 481, msg: "msg not exist!" };
  console.log('cs1');
  const campaign = await campaignController.readOne({ _id: campId });
  console.log('cs2');
  if (!campaign) throw { code: 480, msg: "id campaign not exist!" };
  console.log('cs3');
  return await campaignController.update(
    { _id: campId },
    { $pull: { msg: { _id: msgId } } }
  );
}

async function addNewMsg(id, body) {
  if (!isValidObjectId(id)) throw { code: 401, msg: "inValid _id" };
  if (!body.subject) throw { code: 420, msg: "message without subject" };
  if (!body.content) throw { code: 421, msg: "message without content" };
  if (!body.content) throw { code: 421, msg: "message without content" };
  let campaign = await campaignController.readOne({ _id: id });
  if (!campaign) throw { code: 480, msg: "id campaign not exist!" };
  let filter = { _id: id };

  let messages = {
    subject: body.subject,
    content: body.content,
  };
  return await campaignController.update(filter, { $push: { msg: messages } });
}


async function updateMsg(id, body) {
  if (!isValidObjectId(id)) throw { code: 401, msg: "inValid _id" };

  let campaign = await campaignController.readOne({ _id: id });
  if (!campaign) throw { code: 480, msg: "campaign is not exist!" };
  const msgIndex = campaign.msg.findIndex(msg => {
    return msg._id.toString() === body.msgId
  });
  if (msgIndex === -1) {
    throw { code: 404, msg: "msg not found" }
  }
  let filter = { _id: id, "msg._id": body.msgId };
  let update = {
    $set: {},
  };

  if (body.subject) {

    update.$set[`msg.${msgIndex}.subject`] = body.subject;
  }
  if (body.content) {
    update.$set[`msg.${msgIndex}.content`] = body.content;
  }
  if (!body.content && !body.subject)
    throw { code: 403, msg: "non a text for update" };
  return await campaignController.update(filter, update);
}

async function getAllMsg(id) {
  if (!isValidObjectId(id)) throw { code: 401, msg: "inValid _id" };
  const campaign = await campaignController.readOne({ _id: id });

  if (!campaign) throw { code: 480, msg: "id campaign not exist!" };
  const messages = await campaignController.read({ _id: id }, "msg");
  return messages;
}
async function getOneMsg(campId, msgId) {
  if (!isValidObjectId(campId)) throw { code: 401, msg: "inValid _id" };
  if (!isValidObjectId(msgId)) throw { code: 401, msg: "inValid _id" };

  let camp = await campaignController.readOne({ _id: campId, "msg._id": msgId })
  if (!camp) throw { msg: "no messeges in this campaign", code: 404 }

  return camp.msg.find(m => m._id == msgId)
}



async function checkMsgNum() {
  // hotemet
  // לבדוק כל פעם בכל המקפיין שלו כמה הודעות נשלחו
  // או להוסיף מס הודעות בסכמה
  // ואז השאלה מה זה בדיוק אומר 30 הודעות שנשלחו
}


//לבדוק אחרי שאריה מעלה להוצי מערך שם ומספר טלפון שליחת הודעה לכל הלידים בקמפיין מסויים
async function sendSpecificMsgToCampaignLeads(capId, msgId, userPhone) {
  if (!isValidObjectId(capId)) throw { code: 401, msg: "inValid  camp_id" };
  if (!isValidObjectId(msgId)) throw { code: 401, msg: "inValid msg_id" };
  if (!capId) throw { code: 404, msg: "No campaign found" };
  if (!msgId) throw { code: 404, msg: "No msg found" };

  // hotemet
  const user = userController.readOne({ phone: userPhone });
  const msgSentNow = user.messagesSent || 0;
  if (msgSentNow == 30) {
    const updatedSubscription = await userController.updateUser({ phone: userPhone }, { subscription: 'expired' });
    updatedSubscription ? console.log(updatedSubscription) : console.log('no updatedSubscription');
    throw { code: 403, msg: 'end of trial period' }
  }

  // hotemet
  //userId vs userPhone??
  //TODO- לעלות פה את הקאונטר או לחכות לתשובה מהווצפ שבאמת נשלח
  const updatedMsgCounter = await userController.updateUser({ phone: userPhone }, { messagesSent: msgSentNow + 1 });
  if (!updatedMsgCounter) console.log(`no updatedMsgCounter from ${msgSentNow}`);
  console.log(`update MsgCounter!!! now: ${msgSentNow + 1}`);
  console.log('after update', updatedMsgCounter);


  let campaign = await campaignController.readOne({ _id: capId, "msg._id": msgId })
  if (!campaign) throw { msg: "no messeges in this campaign", code: 404 }


  let msg = campaign.msg.find(m => m._id == msgId)


  campaign.leads.forEach((l) => {
    if (!l.isActive) return;

    const data = {
      phone: l["lead"].phone,
      name: l["lead"].name,
      _id: l["lead"]._id,
      msg: msg.content,
    };
    socket1.emit("data", data);
  });



  return { leads: campaign.leads, msg: "accepted" };
}


async function msgNotSentLeads(campaignObj, msgId) {
  const leadsInCampaign = campaignObj.leads
  const numberOfLeadsInCampaign = leadsInCampaign.length

  const sentLeadsResultsArray = msgSentLeads(campaignObj, msgId)

  const NotSentLeadsArray = leadsInCampaign.filter(campLead => !sentLeadsResultsArray[0].some(msgLead => msgLead._id === campLead._id))

  const NumberOfNotSentLeads = numberOfLeadsInCampaign - sentLeadsResultsArray[1]




  return [NotSentLeadsArray, NumberOfNotSentLeads]
}

// פונקציה שמביאה msg and lead
async function getMsgAndLead(capId, msgId, leadId) {
  if (!isValidObjectId(capId)) throw { code: 401, msg: "inValid camp_id" };
  if (!isValidObjectId(msgId)) throw { code: 401, msg: "inValid msg_id" };
  if (!isValidObjectId(leadId)) throw { code: 401, msg: "inValid lead_id" };
  if (!capId) throw { code: 404, msg: "No campaign found" };
  if (!msgId) throw { code: 404, msg: "No msg found" };
  if (!leadId) throw { code: 404, msg: "No lead found" };
  let sendMsg = await getOneMsg(capId, msgId);
  if (!sendMsg) throw { code: 404, msg: "This msg to send" };
  let campaign = await campaignController.readOne({ _id: capId });
  const arrNew = campaign["leads"];
  if (!arrNew) throw { code: 404, msg: "No lead **** found" };
  let filter = { _id: capId, "leads.lead": leadId };
  const list = await campaignController.readOne(filter);
  const lead = campaign.leads.find(
    (lead) => lead.lead._id.toString() === leadId.toString()
  );

  const singleLead = {
    phone: lead["lead"].phone,
    name: lead["lead"].name,
    _id: lead["lead"]._id,
    msg: sendMsg.content,

  };
  socket2.emit("singleLead", singleLead);
  finalArray = { leads: singleLead, msg: sendMsg };
  return finalArray;
}

// לקשר לפונקציה של טל שמכניסה לידים לmsg
async function updateMsgStatus(capId, msgId, status) {
  if (!isValidObjectId(capId)) throw { code: 401, msg: "inValid camp_id" };
  if (!isValidObjectId(msgId)) throw { code: 401, msg: "inValid msg_id" };
  let msgOne = await getOneMsg(capId, msgId)
  if (!msgOne) throw "not msg";
  let filter = { _id: id, "msg._id": msgId };

  if (status !== "created" || status !== "read" || status !== "sent") throw "dont know the status"

  return campaignController.update(filter, $set('status', status))
}

async function getOneCamp(campId) {
  if (!isValidObjectId(campId)) throw { code: 401, msg: "inValid _id" };
  const campaign = await campaignController.readOne({ _id: campId })
  console.log("cs1- campaign:", campaign);
  if (!campaign) throw ({ msg: "Campaign is not exist", code: 404 })
  return campaign
}

async function pushAllCampaignLeadsToMsgLeads(campaignId, targetMsgId) {
  if (!isValidObjectId(campaignId)) throw { code: 401, msg: "inValid _id" };
  if (!isValidObjectId(targetMsgId)) throw { code: 401, msg: "inValid _id" };
  try {
    const campaignToUpdate = await campaignController.readOne({ _id: campaignId });


    const leadIds = campaignToUpdate.leads.map(lead => ({ lead: lead._id }));
    console.log(leadIds);

    const targetMsg = campaignToUpdate.msg.find(msg => msg._id.equals(targetMsgId));
    console.log(targetMsg);

    if (targetMsg) {

      targetMsg.leads = [...targetMsg.leads, ...leadIds];


      await campaignToUpdate.save();

      console.log("Leads pushed to target message successfully");
    } else {
      console.error("Target message not found in the campaign");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}



async function delLeadFromCamp(capId, leadId) {
  if (!capId) throw { code: 404, msg: "No campaign found" };
  if (!leadId) throw { code: 404, msg: "No lead found" };
  const updateIsActiv = await campaignController.updateOne(
    { _id: capId, "leads.lead": leadId },
    { $set: { "leads.$.isActive": false } }
  );

  return updateIsActiv;
}


async function updateStatusMsgOfOneLead(data) {
  const { campId, msgId, leadId, newStatus } = data;

  if (newStatus !== 'sent' && newStatus !== 'recieved') throw { code: 405, msg: 'status not valid' };
  const campaign = await campaignController.readOneWithoutPopulate({ _id: campId });
  if (!campaign) throw { code: 405, msg: 'no campaign' }
  const message = campaign["msg"].find((m) => m._id == msgId);
  const lead = message["leads"].find((l) => l._id == leadId);
  lead.status = newStatus;
  const updatedCampaign = await campaign.save();
  return updatedCampaign;
}




module.exports = {
  addNewMsg,
  updateMsg,
  getAllCampaignsByUser,
  delOneMessage,
  createNewCampaign,
  getAllMsg,
  getOneMsg,
  updateMsgStatus,
  delLeadFromCamp,
  delCampaign,
  getOneCamp,
  updateMsgStatus,
  delLeadFromCamp,
  getMsgAndLead,
  updateStatusMsgOfOneLead,
  sendSpecificMsgToCampaignLeads,
};
