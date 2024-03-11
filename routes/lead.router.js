const express = require('express');
const router = express.Router();
const leadService = require('../BL/lead.service');
const auth = require('../middlewares/auth');



//ADD LEAD 
router.post('/:campId', async (req, res) => {
    try {
        const campId = req.params.campId
        const data = req.body.data;
        const newLead = await leadService.addLeadToCamp(campId, data);
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
        const newData = req.body.data
        res.send(await leadService.updateLeadInCamp(campId, leadId, newData))
    } catch (err) {
        res.status(400).send(err.msg)
    }
})

//get Lead From All Camps
router.get('/:userId/allLeads', async (req, res) => {
    try {
        const userId = req.params.userId;
        // const leadId = req.params.leadId
        // const leads = await leadService.getLeadFromAllCampS(userId);

        // מידע זמני
        const tempLeads = [
            {
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "123-456-7890",
                notes: "This is a note about John Doe",
                msgs: [
                    {
                        msg: "5fecb27803f455001f95391a",
                        creationDate: "2024-02-01T12:00:00Z"
                    }
                ]
            },
            {
                name: "Alice Smith",
                email: "alice.smith@example.com",
                phone: "987-654-3210",
                notes: "A note about Alice Smith",
                msgs: [
                    {
                        msg: "5fecb27803f455001f95391b",
                        creationDate: "2024-02-01T13:30:00Z"
                    }
                ]
            },
            {
                name: "Bob Johnson",
                email: "bob.johnson@example.com",
                phone: "555-123-4567",
                notes: "Bob's note",
                msgs: [
                    {
                        msg: "5fecb27803f455001f95391c",
                        creationDate: "2024-02-01T14:45:00Z"
                    }
                ]
            },
            {
                name: "Eva Miller",
                email: "eva.miller@example.com",
                phone: "777-888-9999",
                notes: "Eva's note",
                msgs: [
                    {
                        msg: "5fecb27803f455001f95391d",
                        creationDate: "2024-02-01T16:15:00Z"
                    }
                ]
            },
            {
                name: "Sam Brown",
                email: "sam.brown@example.com",
                phone: "444-555-6666",
                notes: "Sam's note",
                msgs: [
                    {
                        msg: "5fecb27803f455001f95391e",
                        creationDate: "2024-02-01T17:45:00Z"
                    }
                ]
            },
            {
                name: "New Lead 1",
                email: "new1@example.com",
                phone: "111-222-3333",
                notes: "A note about New Lead 1",
                msgs: [
                    {
                        msg: "5fecb27803f455001f95391f",
                        creationDate: "2024-02-03T09:30:00Z"
                    }
                ]
            },
            {
                name: "New Lead 2",
                email: "new2@example.com",
                phone: "222-333-4444",
                notes: "A note about New Lead 2",
                msgs: [
                    {
                        msg: "5fecb27803f455001f953920",
                        creationDate: "2024-02-04T10:45:00Z"
                    }
                ]
            },
            {
                name: "New Lead 3",
                email: "new10@example.com",
                phone: "999-888-7777",
                notes: "A note about New Lead 3",
                msgs: [
                    {
                        msg: "5fecb27803f455001f953929",
                        creationDate: "2024-02-05T18:00:00Z"
                    }
                ]
            }
        ]
        const formatTempLeads = tempLeads.map((lead) => ({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            joinDate: "2024-01-27T00:00:00.000Z",
            campaign: "קורס תפירה",
            isOnline: true
        }))
        const heads = [
            { title: 'name', input: 'text' },
            { title: 'email', input: 'text' },
            { title: 'phone', input: 'text' },
            { title: 'joinDate', input: 'date' },
            { title: 'campaign', input: 'select', inputValues: ["קורס תפירה", "חדר כושר", "בריכה עירונית"] },
            { title: 'isOnline', input: '' },
        ]

        res.send({leads: formatTempLeads, heads});

    } catch (err) {
        res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
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
router.delete('/:camp/lead/:leadId', async (req, res) => {
    try {
        const userId = req.body.user._id;
        const leadId = req.params.leadId
        const leads = await leadService.delLeadFromAllCampS(userId, leadId)
        res.send(leads);

    } catch (err) {
        res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
    }
})




// ייצוא הראוטר
module.exports = router;