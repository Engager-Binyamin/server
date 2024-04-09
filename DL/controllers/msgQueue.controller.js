const msgQueueModel = require('../models/msgQueue.model')

async function create(data) {
    return await msgQueueModel.create(data)
}

async function read(filter) {
    return await msgQueueModel.find(filter)
}

async function update(id, data) {
    return await msgQueueModel.updateOne({ _id: id }, data)
}

async function updateQueue(msgId, newDate) {
    const filter = { msgId }
    const update = { $set: { date: newDate } }
    return await msgQueueModel.updateMany(filter, update)
}

async function del(id) {
    return await msgQueueModel.deleteOne({ _id: id })
}

module.exports = { create, read, update, del, updateQueue }