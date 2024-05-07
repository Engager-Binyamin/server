const express = require("express");
const router = express.Router();




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
        const msg = await campaignService.sendSpecificMsgToCampaignLeads(idCamp, msgId, "05057095558")
        res.send(msg);
    } catch (err) {
        console.log({ err });
        res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
    }
});





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
        // TODO funcion to the middleware

        // if(user.subscription !== "trial" && user.subscription !== "active")throw { code: 480, msg: "The user without proper authorization" };

        const idCamp = req.params.idCamp;
        const msgId = req.params.msgId;
        const leadId = req.params.leadId;

        const msg = await campaignService.getMsgAndLead(idCamp, msgId, leadId)
        res.send(msg);
    }
    catch (err) {
        res.status(444).send(err.msg);

    }
});




router.put('/whatsapp/camp/:campId/msg/:msgId/lead/:leadId/newStatus/:newStatus', async (req, res) => {
    try {
        // TODO funcion to the middleware
        // if(user.subscription !== "trial" && user.subscription !== "active")throw { code: 480, msg: "The user without proper authorization" };
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

module.exports = router