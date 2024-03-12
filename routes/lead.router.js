const express = require('express');
const router = express.Router();
const leadService = require('../BL/lead.service');
const auth = require('../middlewares/auth');



//ADD LEAD 
router.post('/:campId/lead', async (req, res) => {
    try {
        const campId = req.params.campId
        const newLead = await leadService.addLeadToCamp(campId, req.body);
        res.send(newLead)
    } catch (err) {
        // res.status(400).send(err)
        console.error(err);
        res.status((err.code) || 400).send({ msg: err.msg || 'something went wrong' });
    }
})
//Update a lead by ID -------------------------------------------
/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a lead by ID
 *     description: Update an existing lead identified by its ID.
 *     tags:
 *       - Lead
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lead to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define properties expected in the request body
 *     responses:
 *       '200':
 *         description: Successfully updated the lead
 *       '400':
 *         description: Bad request. Missing or invalid data provided.
 *       '404':
 *         description: Lead not found
 *       '500':
 *         description: Internal server error
 */

router.put('/:campId/lead/:leadId', async (req, res) => {
    try {
        const campId = req.params.campId
        const leadId = req.params.leadId
        const newData = req.body
        let updated = await leadService.updateLeadInCamp(campId, leadId, newData)
        res.send(updated)
    } catch (err) {
        res.status(400).send(err.msg)
    }
})

//delete Lead From Camp
router.delete('/:campId/lead/:leadId', async (req, res) => {
    try {
        const campId = req.params.campId;
        const leadId = req.params.leadId
        const del = await leadService.delLeadFromCamp(campId, leadId)
        res.send(del);
    } catch (err) {
        res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
    }
})


//delete Lead From All the CampS
router.delete('/lead/:leadId/all', async (req, res) => {
    try {
        const userId = req.body.user._id;
        const leadId = req.params.leadId
        const leads = await leadService.deleteLeadFromAllCamp(userId, leadId)
        res.send(leads);

    } catch (err) {
        res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
    }
})




// ייצוא הראוטר
module.exports = router;