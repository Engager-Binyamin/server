const schedule = require('node-schedule');
const moment = require('moment-timezone');

// SCHEDULE AT A SPECIFIC DATE
function scheduleFunctionAtSpecificDate(cb, targetDate) {
    const job = schedule.scheduleJob(targetDate, cb);
    return job;
}

// CONVERT TO DATE & EXEC
function convertToDateAndExec(dateData, functionToExec) {
    const timeZone = 'Asia/Jerusalem';
    const targetDate = moment.tz(dateData, timeZone).toDate();
    try {
        scheduledJob = executeFunctionAtSpecificDate(() => {
            functionToExec()
        }, targetDate, timeZone);
    } catch (error) {
        console.log(error);
    }
}
// EXECUTE AT A SPECIFIC DATE
function executeFunctionAtSpecificDate(callback, targetDate) {
    const timeZone = 'Asia/Jerusalem';
    const targetTime = moment.tz(targetDate, timeZone);
    const delayInMillis = targetTime - moment();

    const job = scheduleFunctionAtSpecificDate(callback, new Date(Date.now() + delayInMillis));

    return job
}


// ==== because there's no reference to a schedule, it will stop the last scheduled task =====//
function cancelScheduledTask() {

    if (scheduledJob) {
        scheduledJob.cancel()
        console.log("schedule is cancelled");
    } else {
        console.log("no schedule was found");
    }
}


module.exports = {
    scheduleFunctionAtSpecificDate,
    convertToDateAndExec,
    executeFunctionAtSpecificDate,
    cancelScheduledTask
};





