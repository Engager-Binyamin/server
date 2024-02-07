const express = require("express");
const router = express.Router();
const campaignService = require('../BL/campaign.service');
const auth = require("../auth");

// router.use(auth.checkToken)
//*************************************************************
// List of Full Rauts & details - 
// https://engager-g262.onrender.com/api-docs
//*************************************************************

// TODO: לשלוף את המשתמש מהטוקן

/**###### Campeign ######*/
/**-Create a new campaign-VV---------------------------------------------- 
/**
 * @swagger
 * /campaigns/:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *               campName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully created a new campaign
 *       '400':
 *         description: Bad request, check your payload
 *       '500':
 *         description: Internal server error
 */

router.post('/', async (req, res) => {
  try {
    const userId = req.body.user._id;
    const campName = req.body.campName;
    const answer = await campaignService.createNewCampaign(userId, campName);
    console.log("the answer is:  ", answer)
    res.send(answer);
  }
  catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

/** - Get all campaigns of user-VV---------------------------------------------------------------------
 * @swagger
 * /campaigns/{campaignId}: 
 *   get:
 *     summary: Get all campaigns of user
 *     tags: [Campaign]
 *     parameters:             
 *       - in: path             
 *         name: campaignId     
 *         schema:
 *           type: string       
 *         required: true       
 *         description: The ID of the campaign to retrieve
*/

router.get('/', async (req, res) => {
  try {
    const userId = req.body.user._id;
    console.log(userId);
    const campaigns = await campaignService.getAllCampaignsByUser(userId)
    res.send(campaigns);
  }
  catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

/** - Get all massage in campagin -VV---------------------------------------------------------------------
 * @swagger
 * /campaigns/{campId}:
 *   get:
 *     summary: Get all messages in a campaign
 *     tags: 
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the campaign 
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Campaign not found
 */

router.get('/:campId', async (req, res) => {
  try {
    const campId = req.params.campId;
    const campaign = await campaignService.getOneCamp(campId);
    res.send(campaign);
  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

/** Delete campaign-VV----------------------------------------------------
 * @swagger
 * /campaigns/{campId}:
 *   delete:
 *     summary: Delete a campaign by ID
 *     tags: 
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         description: ID of the campaign to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted the campaign
 *       '404':
 *         description: Campaign not found
 *       '500':
 *         description: Internal server error
 */


// מחיקת קמפיין
router.delete('/:campId', async (req, res) => {
  try {
    let deletedCamp = await campaignService.delCampaign(req.params.campId)
    res.send(deletedCamp);
  } catch (err) {
    res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

//  ######## הודעות  ##########

// כל ההודעות של קמפיין בודד
router.get('/:campId/msg', async (req, res) => {
  try {
    const msgCampaigns = await campaignService.getAllMsg(req.params.campId)
    res.send(msgCampaigns);
  }
  catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

/**###### Message ######*/

// get all message of singale campain ---VV-------------------------
/**
 * @swagger
 * /{campId}/msg:
 *   get:
 *     summary: Get all messages of a single campaign
 *     description: Retrieves all messages associated with the specified campaign ID.
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         description: ID of the campaign
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved all messages of the campaign
 *       '404':
 *         description: Campaign not found
 *       '500':
 *         description: Internal server error
 */

router.get('/:campId/msg', async (req, res) => {
  try {
    const msgCampaign = await campaignService.getAllMsg(req.params.campId)
    res.send(msgCampaign);
  }
  catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

// - add new msg into campaign --VV--------------------------------------------------------------------
/** 
* @swagger
* /campaigns/{campId}/msg:
*   post:
*     summary: Add a new message into a campaign
*     tags: [Message]
*     parameters:
*       - in: path
*         name: campId
*         required: true
*         schema:
*           type: string
*         description: The ID of the campaign to add a message to
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               message:
*                 type: string
*                 description: The content of the message to add
*             required:
*               - message
*     responses:
*       '200':
*         description: Message added successfully
*       '400':
*         description: Bad request, check your parameters
*       '404':
*         description: Campaign not found
*       '500':
*         description: Internal server error
*/

router.post('/:campId/msg/', async (req, res) => {
  try {
    const id = req.params.campId;
    const msg = await campaignService.addNewMsg(id, req.body);
    res.send(msg);
  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
});

//-Delete a message from a campaign----VV---------------
/**
 * @swagger
 * /campaigns/{campId}/msg/{msgId}:
 *   delete:
 *     summary: Delete a message from a campaign
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the campaign from which to delete the message
 *       - in: path
 *         name: msgId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to delete
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 *       '400':
 *         description: Bad request, check your parameters
 *       '404':
 *         description: Campaign or message not found
 *       '500':
 *         description: Internal server error
 */

router.delete('/:campId/msg/:msgId', async (req, res) => {
  try {
    const idCamp = req.params.campId;
    const msgId = req.params.msgId;
    const del = await campaignService.delOneMessage(idCamp, msgId);
    res.send(`message ${msgId} is deleted`);
  }
  catch (err) {
    {
      res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
    }
  }
})

// get singel messsag out of singel campaign ----------VV----------------
/**
 * @swagger
 * /campaigns/{campId}/msg/{msgId}:
 *   get:
 *     summary: get singel messsag out of singel campaign
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: campId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the campaign
 *       - in: path
 *         name: msgId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to retrieve
 *     responses:
 *       '200':
 *         description: Message retrieved successfully
 *       '502':
 *         description: Bad gateway, internal server error
 */
router.get('/:campId/msg/:msgId', async (req, res) => {
  try {
    const campId = req.params.campId;
    const msgId = req.params.msgId;
    const msg = await campaignService.getOneMsg(campId, msgId);
    console.log("the msg that return is:  ", msg);
    res.send(msg);
  }
  catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });

  }
})

//Get a specific message from a campaign ----VV-------------------------
/**
 * @swagger
 * /campaigns/{campId}/msg/{msgId}:
 *   get:
 *     summary: Get a specific message from a campaign
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the campaign from which to retrieve the message
 *       - in: path
 *         name: msgId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to retrieve
 *     responses:
 *       '200':
 *         description: Message retrieved successfully
 *       '404':
 *         description: Campaign or message not found
 *       '502':
 *         description: Internal server error
 */

router.get('/:campId/msg/:msgId', async (req, res) => {
  try {
    const campId = req.params.campId;
    const msgId = req.params.msgId;
    const msg = await campaignService.getOneMsg(campId, msgId);
    console.log("the msg that return is:  ", msg);
    res.send(msg);
  }
  catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

// update single Message---VV---------
/**
 * @swagger
 * /campaigns/{campId}/msg/{msgId}:
 *   put:
 *     summary: update single Message
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: campId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the campaign
 *       - in: path
 *         name: msgId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Message updated successfully
 *       '400':
 *         description: Bad request, check your parameters
 *       '404':
 *         description: Campaign or message not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:campId/msg/:msgId", async (req, res) => {
  try {
    const id = req.params.campId;
    const msgId = req.params.msgId;
    req.body = { ...req.body, msgId }
        const msg = await campaignService.updateMsg(id, req.body);
    res.send(msg);
  }
  catch (err){
  res.status(err.code || 490).send({msg: err.msg || 'something went wrong'})
  }
});

//Delete a message from a campaign-VV-----------
/**
 * @swagger
 * /campaigns/{campId}/msg/{msgId}:
 *   delete:
 *     summary: Delete a message from a campaign
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: campId
 *         schema:
 *           type: string
 *         required: true
 *         description: MONGO _id of campaign
 *       - in: path
 *         name: msgId
 *         schema:
 *           type: string
 *         required: true
 *         description: MONGO _id of the message to delete
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 *       '404':
 *         description: Campaign or message not found
 *       '500':
 *         description: Internal server error
 */

router.delete('/:campId/msg/:msgId', async (req, res) => {
  try {
    const idCamp = req.params.campId;
    const msgId = req.params.msgId;
    const msg = await campaignService.sendMsgForCampaign(idCamp, msgId)
    res.send(msg);

  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }

})

// get all leads from WhatsApp ---VV-----------------
/**
 * @swagger
 * /whatsapp/camp/{idCamp}/msg/{msgId}/leads:
 *   get:
 *     summary: Get all leads from WhatsApp
 *     tags:
 *       - WhatsApp
 *     parameters:
 *       - in: path
 *         name: idCamp
 *         required: true
 *         description: ID of the campaign
 *         schema:
 *           type: string
 *       - in: path
 *         name: msgId
 *         required: true
 *         description: ID of the message
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved WhatsApp leads
 *       '404':
 *         description: Leads not found for the given campaign and message ID
 *       '500':
 *         description: Internal server error
 */

router.get('/whatsapp/camp/:idCamp/msg/:msgId/leads', async (req, res) => {
  try {
    const idCamp = req.params.idCamp;
    const msgId = req.params.msgId;
    const msg = await campaignService.getArrLeadOfCamp(idCamp, msgId)
    res.send(msg);
  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

// function for whatsapp single lead -VV------------------------
/**
 * @swagger
 * /whatsapp/camp/{idCamp}/msg/{msgId}/lead/{leadId}:
 *   get:
 *     summary: Get a single lead from WhatsApp
 *     description: Retrieves a single lead from WhatsApp based on the specified campaign ID, message ID, and lead ID.
 *     tags:
 *       - WhatsApp
 *     parameters:
 *       - in: path
 *         name: idCamp
 *         required: true
 *         description: ID of the campaign
 *         schema:
 *           type: string
 *       - in: path
 *         name: msgId
 *         required: true
 *         description: ID of the message
 *         schema:
 *           type: string
 *       - in: path
 *         name: leadId
 *         required: true
 *         description: ID of the lead
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the WhatsApp lead
 *       '404':
 *         description: Lead not found for the given campaign, message, and lead ID
 *       '444':
 *         description: Custom error code for the specific scenario
 */

router.get('/whatsapp/camp/:idCamp/msg/:msgId/lead/:leadId', async (req, res) => {
  try {
    const idCamp = req.params.idCamp;
    const msgId = req.params.msgId;
    const leadId = req.params.leadId;

    const msg = await campaignService.getMsgAndLead(idCamp, msgId, leadId)
    res.send(msg);
  }
  catch (err) {
    res.status(444).send(err.msg);

  }
})

// delet lead from Campaign --VV---------------------------------
/**
 * @swagger
 * /{idCamp}/lead/{leadId}:
 *   delete:
 *     summary: Delete a lead from a campaign
 *     description: Deletes a lead from the specified campaign.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: idCamp
 *         required: true
 *         description: ID of the campaign
 *         schema:
 *           type: string
 *       - in: path
 *         name: leadId
 *         required: true
 *         description: ID of the lead to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted the lead
 *       '404':
 *         description: Lead not found for the given campaign and lead ID
 *       '405':
 *         description: Method Not Allowed
 */

router.delete('/:idCamp/lead/:leadId', async (req, res) => {
  try {

    const idCamp = req.params.idCamp;
    const leadId = req.params.leadId
    const del = await campaignService.delLeadFromCamp(idCamp, leadId)
    res.send(del);
  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})


router.put('/whatsapp/camp/:campId/msg/:msgId/lead/:leadId/newStatus/:newStatus', async (req, res) => {
  try {
    const campId = req.params.campId;
    const msgId = req.params.msgId;
    const leadId = req.params.leadId;
    const newStatus = req.params.newStatus;
    const ans = await campaignService.updateStatusMsgOfOneLead(campId, msgId, leadId, newStatus);
    res.send(ans);
  } catch (err) {
    console.log(err);
    res.status(405).send(err.msg);
  }
})
// ייצוא הראוטר
module.exports = router;
