const campaignController = require("../DL/controllers/campaign.controller");
const userController = require("../DL/controllers/user.controller")
const { io } = require("socket.io-client");
const socket1 = io("http://localhost:3000");  //?
// TODO - socket2 ??
const { isValidObjectId } = require('./functions')


// TO SEND  specifi msg to camp's lead 
async function sendSpecificMsgToCampaignLeads(capId, msgId, userPhone) {
    if (!isValidObjectId(capId)) throw { code: 401, msg: "inValid  camp_id" };
    if (!isValidObjectId(msgId)) throw { code: 401, msg: "inValid msg_id" };
    if (!capId) throw { code: 404, msg: "No campaign found" };
    if (!msgId) throw { code: 404, msg: "No msg found" };
    let campaign = await campaignController.readOne({ _id: capId, "msg._id": msgId })
    if (!campaign) throw { msg: "no messeges in this campaign", code: 404 }

    let msg = campaign.msg.find(m => m._id == msgId);
    const leadsArr = msg.leads;
    console.log('msgLaRR', leadsArr);

    leadsArr.forEach((l) => {
        if (!l.isActive) return;

        const data = {
            phone: l["lead"].phone,
            name: l["lead"].name,
            _id: l["lead"]._id,
            msg: msg.content,
        };
        // socket1.emit("data", data);
    });

    //TODO: לעלות פה את הקאונטר או לחכות לתשובה מהווצפ שבאמת נשלח
    const user = userController.readOne({ phone: userPhone });
    const msgSentNow = user.messagesSent || 0
    const updatedMsgCounter = await userController.updateUser({ phone: phone }, { messagesSent: msgSentNow + 1 });

    if (msgSentNow >= 29) {
        const updatedSubscription = await userController.updateUser({ phone: phone }, { subscription: "expired" });
        throw { code: 403, msg: 'end of trial period' }
    }

    return { leads: campaign.leads, msg };
}


//TO GET MSG & LEAD
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



//RECIVED !!!

// THE MSG THAT WAS SENT TO LEADS 
async function msgSentLeads(campaignObj, msgId) {
    const msgObject = campaignObj?.msg?.find?.(msgObj => msgObj._id === msgId)
    const arrayOfLeadsInMsg = msgObject?.leads || []

    return arrayOfLeadsInMsg
}

//THE MSGS THAT DO NOT SENT TO LEADS 
async function msgNotSentLeads(campaignObj, msgId) {
    const leadsInCampaign = campaignObj.leads;
    const sentLeadsResultsArray = await msgSentLeads(campaignObj, msgId);
    const NotSentLeadsArray = leadsInCampaign.filter(campLead => !sentLeadsResultsArray.some(msgLead => msgLead._id === campLead._id));

    return NotSentLeadsArray
}

// TO PUSH ALL CAMP LEADS TO THE MSG LEADS
async function pushAllCampaignLeadsToMsgLeads(campaignId, targetMsgId) {
    if (!isValidObjectId(campaignId)) throw { code: 401, msg: "inValid _id" };
    if (!isValidObjectId(targetMsgId)) throw { code: 401, msg: "inValid _id" };
    try {
        const campaignToUpdate = await campaignController.readOne({
            _id: campaignId,
        });

        const leadIds = campaignToUpdate.leads.map((lead) => ({ lead: lead._id }));
        console.log(leadIds);

        const targetMsg = campaignToUpdate.msg.find((msg) =>
            msg._id.equals(targetMsgId)
        );
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


// TO UPDATE DTATUS MSG TO JUST ONE LEAD
async function updateStatusMsgOfOneLead(data) {
    const { campId, msgId, leadId, issend } = data;
    console.log('issend', issend);
    if (issend != "sent" && issend != "recieved")
        throw { code: 405, msg: "status not valid" };
    const campaign = await campaignController.readOneWithoutPopulate({
        _id: campId
    });
    if (!campaign) throw { code: 405, msg: "no campaign" };
    const message = campaign["msg"].find((m) => m._id == msgId);
    console.log("message", message);
    const lead = message["leads"].find((l) => l.lead == leadId);
    lead.status = issend;
    const updatedCampaign = await campaign.save();
    return updatedCampaign;
}


// TODO ?? NECESSARY ?


socket1.on('connect', () => {
    console.log('Connected to server');
});

socket1.on('sent', async (data) => {
    try {
        console.log(data.rtrnData);
        // const res = await updateStatusMsgOfOneLead(data.rtrnData)  לצורך בדיקה הורדתי 
        // console.log(res);

    }
    catch (err) {
        console.error(err)
    }
});


module.exports = {
    sendSpecificMsgToCampaignLeads,
    getMsgAndLead,
    msgSentLeads,
    msgNotSentLeads,
    pushAllCampaignLeadsToMsgLeads,
    updateStatusMsgOfOneLeadת
}

