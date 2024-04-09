const campaignController = require("../DL/controllers/campaign.controller");
const userController = require("../DL/controllers/user.controller")
// const { io } = require("socket.io-client");
// const socket1 = io("http://localhost:3000");  //?
const { isValidObjectId } = require('../utilities/helper')
const auth = require("../middlewares/auth")






// To get all the campaigns (only if is active) and the information (user & msg & leads & received msgs)
// do not touch!!!!
async function getAllCampaignsByUser(userId) {
  if (!isValidObjectId(userId)) throw { code: 401, msg: "inValid _id" };
  const campaigns = await campaignController.read({ user: userId, isActive: true });
  if (!campaigns.length) throw { code: 404, msg: "no campaigns for this user" };
  campaigns.forEach(campaign => {
    campaign.leads = campaign.leads.filter(lead => lead.isActive);
  });
  return campaigns;
}


// To get jus ONE campaign and the information (user & msg & leads & received msgs)
async function getOneCamp(campId) {
  if (!isValidObjectId(campId)) throw { code: 401, msg: "inValid _id" };
  const campaign = await campaignController.readOne({ _id: campId, isActive: true });
  campaign.leads = campaign.leads.filter(lead => lead.isActive);

  if (!campaign) throw { msg: "Campaign is not exist", code: 404 };
  return campaign;
}


//To create a new campaign [The name must be unique]
async function createNewCampaign(userId, body) {
  const { title, details, starterMsg, img } = body;
  if (!isValidObjectId(userId)) throw { code: 401, msg: "inValid _id" };
  campName = title.trim();
  const nameIsExist = await campaignController.readOne({
    user: userId,
    title: campName,
  });
  if (nameIsExist) throw { code: 404, msg: "This name already exists" };
  const campaignData = {
    user: userId,
    title: campName,
    details: details,
    img: img,
    msg: starterMsg ? [{ subject: 'הודעת התנעה!', content: starterMsg, zeroMessage: true }] : []
  }

  const createdCampaign = await campaignController.create(campaignData);

  //creating webhook from campaign id:
  const token = await auth.createToken(createdCampaign._id, userId)
  const updatedCampaign = await campaignController.update({_id:createdCampaign._id}, {webhook : token})

  //updating user to include new campaign:
  const updatedUser = await userController.updateOne({ _id: userId }, { $push: { campaigns: createdCampaign._id } });
  // const newCamp = await getOneCamp(createdCampaign._id)
  return updatedCampaign;
}


// To uodate a campaign by _Id
async function updateCampaign(campId, data) {

  const { title, details, img } = data;
  const filter = { _id: campId };
  const update = {};

  if (title) update.title = title;
  if (details) update.details = details;
  if (img) update.img = img;

  return await campaignController.update(filter, update);
}

//To delete one campaign [isActive : false]
async function delCampaign(campId) {
  if (!isValidObjectId(campId)) throw { code: 401, msg: "inValid _id" };
  const campaign = campaignController.readOne({ _id: campId });
  if (!campaign) throw { code: 404, msg: "Campaign is not exist!" };
  return await campaignController.update({ _id: campId }, { isActive: false });
}


module.exports = {
  getAllCampaignsByUser,
  getOneCamp,
  createNewCampaign,
  updateCampaign,
  delCampaign
}
