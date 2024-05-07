const userController = require("../DL/controllers/user.controller");
const feedbackController = require("../DL/controllers/feedback.controller");

// Creates new feedback

async function sendFeedback(userId, data) {

    let userExist = await userController.readOne({_id: userId});
    if (!userExist) throw { code: 500, msg: "User does not exist, cannot create feedback." };
    return await feedbackController.create(data);
}

// Returns feedback for a specific user ID.
async function getFeedbackById(userId) {

    let userExist = await userController.readOne({_id: userId});

    if (!userExist) throw { code: 500, msg: "User not found, cannot get feedback." };
   
    //if there is no feedbacks for this user
    if (feedbacks.length === 0) throw { code: 404, msg: "No feedbacks found for this user." };

    return await feedbackController.read({_id: userId});
}

// Returns all feedbacks from all users

async function getAllFeedbacks() {

    let feedbacks = await feedbackController.read();

    if (!feedbacks) throw { code: 500, msg: "Failed to return feedbacks." };

    return feedbacks;
    ;
}
module.exports = { sendFeedback,getFeedbackById,getAllFeedbacks }
