
/*
This router handles feedback operations for users.

Endpoints:
1. POST /:userId - Add new feedback for a specific user.
2. GET /:userId - Rturn  all feedbacks for a specific user by his user ID.
3. GET / - Get all feedbacks from all users.

Usage:

- To add feedback, send a POST request to /:userId with feedback details in the body, includes the user ID in the path.
- To get feedback for a specific user, send a GET request to /:userId.
- To get all feedbacks, send a GET request to /.

Creators: Refael & Jacob

*/

const feedbackService = require('../BL/feedback.service')
const express = require("express");
const router = express.Router();

//Add new feedback
router.post('/:userId', async (req, res) => {

    try {
        let userId = req.params.userId;
        const feedback = await feedbackService.sendFeedback(userId, req.body.data);
        if (!feedback) {
            return res.status(404).send({ msg: "User not found" });
        }
        res.send(feedback);
    } catch (err) {
        console.error(err);
        res.status(err.code || 500).send({ msg: err.msg || "Something went wrong" });
    }
});

//Get all feedbacks of user by his user ID
router.get('/:userId', async (req, res) => {

    try {
        let userId = req.params.userId;
        const feedback = await feedbackService.getFeedbackById(userId);
        console.log(feedback);
        if (!feedback) {
            return res.status(404).send({ msg: "Feedback for the specified user not found." });
        }
        res.send(feedback);
    } catch (err) {
        console.error(err);
        res.status(err.code || 500).send({ msg: err.msg || "Something went wrong" });
    }
});

// Get all feedbacks from all users
router.get('/', async (req, res) => {

    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        if (!feedbacks) {
            return res.status(404).send({ msg: "No feedbacks found in the system." });
        }
        res.send(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(err.code || 500).send({ msg: err.msg || "Something went wrong" });
    }
});

module.exports = router