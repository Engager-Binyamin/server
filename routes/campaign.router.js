const express = require("express");
const router = express.Router();
const campaignService = require('../BL/campaign.service');
// const scheduleService = require('../BL/schedule.service');
// const { scheduledJobs } = require("node-schedule");
const {checkClient} = require("../middlewares/auth");

// בדיקת טוקן באופן אוטומטי לפני שאר הראוטרים
// לשקול לאפשר שורה זו
// router.use(auth.checkClient)

// create a new campaign
router.post('/', async (req, res) => {
  try {
    // {"campName":"camp1",{"user":{"_id":"65743643"}}}
    const userId = req.body.user._id;
    const body = req.body;
    const answer = await campaignService.createNewCampaign(userId, body);
    console.log("the answer is:  ", answer)
    res.send(answer);
  }
  catch (err) {
    console.log(err);
    // res.status(404).send(err.msg);
    res.status((err.code) || 404).send({ msg: err.msg || 'something went wrong' });

  }
})

// get all campigns
router.get('/',checkClient, async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.user._id;
    const campaigns = await campaignService.getAllCampaignsByUser(userId)
    res.send(campaigns);
  }
  catch (err) {
    // res.status(err.code).send(err.msg);
    res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

// get one campign
router.get('/:campId', async (req, res) => {
  try {
    const campId = req.params.campId;
    const campaign = await campaignService.getOneCamp(campId);
    res.send(campaign);
  } catch (err) {
    // res.status(err.code).send(err.msg);
    res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

  }
})

// update one campign
router.put('/:campId', async (req, res) => {
  try {
    const campId = req.params.campId;
    const data = req.body.data
    const campeing = await campaignService.updateCampaign(campId, data)
    res.send(campeing)
  }
  catch (err) {
    res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

  }
})

// delete one campign
router.delete('/:campId', async (req, res) => {
  try {
    let deletedCamp = await campaignService.delCampaign(req.params.campId)
    res.send(deletedCamp);
  } catch (err) {
    // res.status(404).send(err.msg);
    res.status((err.code) || 404).send({ msg: err.msg || 'something went wrong' });

  }
})





module.exports = router;
