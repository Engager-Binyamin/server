const feedbackModel = require('../models/feedback.model')


async function create(data) {
    return await feedbackModel.create(data)
}

async function read(filter = {}) {
    return await feedbackModel.find(filter).populate('User');
}

module.exports = { create, read }