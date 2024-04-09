const express = require("express");
const router = express.Router();
const msgService = require('../BL/msg.service');
const scheduleService = require('../BL/schedule.service');
const { scheduledJobs } = require("node-schedule");
const auth = require("../middlewares/auth");
const campaignService = require('../BL/campaign.service');
const { countMsg, msgCopywriting } = require('../middlewares/plans')
const msgQueueController = require('../DL/controllers/msgQueue.controller')
// To get all messages of a specific campaign
router.get('/:campId/msg', async (req, res) => {
    try {
        const msgCampaigns = await msgService.getAllMsg(req.params.campId)
        res.send(msgCampaigns);
    }
    catch (err) {
        // res.status(err.code).send(err.msg);
        res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

    }
})

// --------------------------------------------------------------------
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

//add new msg into campaign 
router.post('/:campId/msg', countMsg, async (req, res) => {
    try {
        const campId = req.params.campId;
        const data = req.body.data
        const msg = await msgService.addNewMsg(campId, data);
        res.send(msg);
    } catch (err) {
        // res.status(err.code).send(err.msg);
        res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

    }
});

//---------------
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

// To delete msg [isActive : false ]
router.delete('/:campId/msg/:msgId', async (req, res) => {
    try {
        const idCamp = req.params.campId;
        const msgId = req.params.msgId;
        const del = await msgService.delOneMessage(idCamp, msgId);
        res.send(del);
    }
    catch (err) {
        // res.status(err.code).send(err.msg);
        res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

    }
})

//-------------------------------
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

// //get a singel messsag out of singel campaign
// router.get('/:campId/msg/:msgId', async (req, res) => {
//     try {
//         const campId = req.params.campId;
//         const msgId = req.params.msgId;
//         scheduleService.scheduleTest("yes", "no")
//         const msg = await msgService.addNewMsg(campId, msgId);

//         console.log("the returned msg is:  ", msg);
//         res.send(msg);
//     }
//     catch (err) {
//         // res.status(502).send(err.msg);
//         res.status((err.code) || 502).send({ msg: err.msg || 'something went wrong' });

//     }
// })


//TODO
//ERROR

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
        const msg = await msgService.getOneMsg(campId, msgId);
        console.log("the msg that return is:  ", msg);
        res.send(msg);
    }
    catch (err) {
        // res.status(502).send(err.msg);
        res.status((err.code) || 502).send({ msg: err.msg || 'something went wrong' });

    }
});




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
        const campId = req.params.campId;
        const msgId = req.params.msgId;
        body = req.body.data
        const msg = await msgService.updateMsg(campId, msgId, body);
        res.send(msg);
    } catch (err) {
        // res.status(err.code).send(err.msg);
        res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

    }
});


/**
* @swagger
* /campaigns/{campId}/msg/{msgId}:
*   post:
*     summary: Send a message to leads least of one campaign
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

//Send a message to leads least of one campaign


// TODO- למה זה מחיקה? זה היה אמור להיות פונ אחרת?

//TODO
router.post('/:campId/msg/:msgId', async (req, res) => {
    try {
        const userPhone = req.body.user.phone;
        const idCamp = req.params.campId;
        const msgId = req.params.msgId;
        const msg = await campaignService.sendSpecificMsgToCampaignLeads(idCamp, msgId, userPhone);
        res.send(msg);
    } catch (err) {
        // res.status(err.code).send(err.msg);
        res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });

    }
})

router.put('/:campId/msg/:msgId/update-queue', async (req, res) => {
    campaignId = req.params.campId
    messageId = req.params.msgId
    const newDate = req.body.miliSecondsDate
    try {
        const msg = await msgService.getOneMsg(campaignId, messageId)
        if (msg) {
            const result = msgQueueController.updateQueue(messageId, newDate)
            const response = {
                acknowledged: result.acknowledged,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            }
            // const response = { success: true }
            // res.send(response)
            if (response.acknowledged && response.modifiedCount > 0) {

                res.send({ success: true, message: "Update successful.", data: response })
            } else if (response.acknowledged && response.matchedCount === 0) {

                res.send({ success: false, message: "No documents found to update.", data: response });
            } else if (response.acknowledged && response.modifiedCount === 0) {

                res.send({ success: false, message: "Documents already up to date.", data: response });
            } else {

                res.send({ success: false, message: "Update not acknowledged by the server.", data: response });
            }
        }
    } catch (error) {
        res.status((err.code) || 500).send({ msg: err.msg || 'something went wrong' });
    }
})


module.exports = router