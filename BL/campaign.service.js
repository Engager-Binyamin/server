const campaignController = require("../DL/controllers/campaign.controller");
const { io } = require("socket.io-client");
const socket1 = io("http://localhost:3000");

async function createNewCampaign(userId, campName) {
  console.log(userId, campName);
  campName = campName.trim();
  const nameIsExist = await campaignController.readOne({
    user: userId,
    title: campName,
  });
  console.log(nameIsExist);
  if (nameIsExist) throw { code: 404, msg: "This name already exists" };
  const created = await campaignController.create({
    user: userId,
    title: campName,
  });
  return created;
}

async function getAllCampaignsByUser(userId) {
  // do not touch!!!!
  const campaigns = await campaignController.read({ user: userId });
  if (!campaigns.length) throw { code: 404, msg: "no campaigns for this user" };
  return campaigns;
}
async function delCampaign(campId) {
  const campaign = campaignController.readOne({ _id: campId });
  if (!campaign) throw { code: 404, msg: "Campaign is not exist!" };
  return await campaignController.update({ _id: campId }, { isActive: false })
}
async function delOneMessage(campId, msgId) {
  
  const message = await getOneMsg(campId, msgId)
  console.log("message: ",message );
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
  if (!body.subject) throw { code: 420, msg: "message without subject" };
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
  
  let campaign = await campaignController.readOne({ _id: id });
  if (!campaign) throw { code: 480, msg: "campaign is not exist!" };
  const msgIndex = campaign.msg.findIndex(msg=> {
    return msg._id.toString() === body.msgId});
  if (msgIndex === -1) {
    throw {code: 404, msg: "msg not found"}
  }
  let filter = { _id: id, "msg._id" : body.msgId };
  let update = { 
    $set:{},
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
  const campaign = await campaignController.readOne({ _id:id });
  if (!campaign) throw { code: 480, msg: "id campaign not exist!" };
  const messages = await campaignController.read({ _id: id }, "msg");
  return messages;
}
async function getOneMsg(campId,msgId){
  let campaigns = await getAllMsg(campId)
  let campaign = campaigns[0]
  if (campaigns.length<1) ({msg: "no messeges in this campaign", code: 404})
  let mssg =   campaign.msg
    if (!mssg) throw ({msg: "no messeges in this campaign", code: 404})
   let msgToFind =  mssg.find((m) => m._id== msgId)
   if (!msgToFind) throw ({msg: "messeges is not exist", code: 404})
    return msgToFind
   
  }


//לבדוק אחרי שאריה מעלה להוצי מערך שם ומספר טלפון שליחת הודעה לכל הלידים בקמפיין מסויים
async function getArrLeadOfCamp(capId, msgId) {
  if (!capId) throw { code: 404, msg: "No campaign found" };
  if (!msgId) throw { code: 404, msg: "No msg found" };
  let sendMsg = await getOneMsg(capId, msgId);
  if (!sendMsg) throw { code: 404, msg: "This msg to send" };
  let campaign = await campaignController.readOne({ _id: capId });
  const arrNew = campaign["leads"];
  if (!arrNew) throw { code: 404, msg: "No lead found" };
  const list = arrNew.map((l) => {
    if (l.isActive) {
      const data = {
        phone: l["lead"].phone,
        name: l["lead"].name,
        _id: l["lead"]._id,
        msg: sendMsg.content,
      };
      socket1.emit("data", data);
      return {
        phone: l["lead"].phone,
        name: l["lead"].name,
        email: l["lead"].email,
        _id: l["lead"]._id,
      };
    }
  });
  finalArray = { leads: list, msg: sendMsg };
  return finalArray;
}
// פונקציה שמביאה msg and lead
async function getMsgAndLead(capId, msgId, leadId) {
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
  let msgOne = await getOneMsg(capId, msgId)
  if (!msgOne) throw "not msg";
  let filter = { _id: id, "msg._id": msgId };

  if (status !== "created" || status !== "read" || status !== "sent") throw "dont know the status"

  return campaignController.update(filter, $set('status', status))
}

async function getOneCamp(campId) {
  const campaign = await campaignController.readOne({ _id: campId })
  if (!campaign) throw ({ msg: "Campaign is not exist", code: 404 })
  return campaign
}

async function pushAllCampaignLeadsToMsgLeads(campaignId, targetMsgId) {
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
async function getOneCamp(campId) {
  const campaign = await campaignController.readOne({ _id: campId });
  console.log("camp from service", campaign);
  return campaign;
}

async function updateStatusMsgOfOneLead(data) {
  const {campId, msgId, leadId, newStatus} = data ;

  if (newStatus !== 'sent'  && newStatus !== 'recieved') throw {code: 405, msg: 'status not valid'};
    const campaign = await campaignController.readOneWithoutPopulate({ _id: campId });
    if (!campaign) throw {code: 405, msg: 'no campaign'}
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
  getArrLeadOfCamp,
  getOneMsg,
  updateMsgStatus,
  delLeadFromCamp,
  delCampaign,
  getAllMsg,
  getOneCamp,
  updateMsgStatus,
  delLeadFromCamp,
  getMsgAndLead,
  updateStatusMsgOfOneLead,
};
