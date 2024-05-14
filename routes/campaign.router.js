const express = require("express");
const router = express.Router();
const campaignService = require('../BL/campaign.service');
// const scheduleService = require('../BL/schedule.service');
// const { scheduledJobs } = require("node-schedule");
const { mwToken } = require("../middlewares/auth");
// const {checkClient} = require("../middlewares/auth");
const { maxCamp } = require("../middlewares/plans");


// בדיקת טוקן באופן אוטומטי לפני שאר הראוטרים
// לשקול לאפשר שורה זו
// router.use(auth.mwToken)

// create a new campaign
// הוספנו פונ מידל-וור כי היוזר מהקונטקסט בקליינט נמחק כל ריפרוש ואז מגיע לפה ריק
// אז באופן זמני מידל-וור דוחפת יוזר לבודי
// מחילה על העברית לכל החכמים
router.post('/', mwToken, maxCamp, async (req, res) => {
  try {
    console.log('body', req.body);
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

router.get('/msg/all-not-received', mwToken , async (req, res) => {
  try {
    const msgs = await campaignService.getMessagesNotSentByUser(req.body.user._id)
    res.json(msgs)
  } catch (error) {
    console.log({error});
    res.status((err.code) || 404).send({ msg: err.msg || 'something went wrong' });
  }
})

// get all campigns
router.get('/', mwToken, async (req, res) => {
  try {
    const userId = req.body.user._id;
    const campaigns = await campaignService.getAllCampaignsByUser(userId)
    res.send(campaigns);
  }
  catch (err) {
    // res.status(err.code).send(err.msg);
    res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });
  }
})


// TODO - probably not working missing :leadId
router.get('/leadId/all', async (req, res) => {
  try {
    const leadId = req.params.leadId
    const userId = req.body.user._id;
    const campaigns = await campaignService.getAllCampaignsByLead(leadId, userId)
    res.send(campaigns);
  } catch (error) {
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
