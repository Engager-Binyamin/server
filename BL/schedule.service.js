const schedule = require('node-schedule');
const moment = require('moment-timezone');

let scheduledJob

function scheduleFunctionAtSpecificDate(cb, targetDate) {
    const job = schedule.scheduleJob(targetDate, cb);
    return job;
}

function convertToDateAndExec(dateData, functionToExec) {
    const timeZone = 'Asia/Jerusalem';
    const targetDate = moment.tz(dateData, timeZone).toDate();
    try {
        scheduledJob = executeFunctionAtSpecificDate(() => {
            functionToExec()
        }, targetDate, timeZone);
        console.log(scheduledJob);
    } catch (error) {
        console.log(error);
    }
}

function executeFunctionAtSpecificDate(callback, targetDate) {
    const timeZone = 'Asia/Jerusalem';
    const targetTime = moment.tz(targetDate, timeZone);
    const delayInMillis = targetTime - moment();

    const job = scheduleFunctionAtSpecificDate(callback, new Date(Date.now() + delayInMillis));

    return job
}


// ==== because there's no reference to a schedule, it will stop the last scheduled task =====//
function cancelScheduledTask() {

    console.log(scheduledJob);
    if (scheduledJob) {
        scheduledJob.cancel()
        console.log("schedule is cancelled");
    } else {
        console.log("no schedule was found");
    }
}


module.exports = { convertToDateAndExec, cancelScheduledTask };










// job.cancel() - will be used to cancel a recurring job
