//TODO 
// חבילות משתמש 

const { update } = require("../DL/controllers/campaign.controller");
const userController = require("../DL/controllers/user.controller");
const planController = require("../DL/controllers/plan.controller")

// סיום תקופת נסיון ושינוי הסבסקרפשן ל-אקספרייד
async function endOfTrialPeriod(phone) {
    const user = await userController.readOne({ phone: phone },'','subscription');
    const subscription = user.subscription.name;
    let updatedUser;
    if (subscription == 'free') {
        updatedUser = userController.updateUser({ phone: phone }, { subscription: '' });
    }
    return updatedUser
}

async function readPlan(){
    return await planController.read()
}
async function readPlanOne(){
    return await planController.readOne()
}

module.exports = {
    readPlan,
    readPlanOne,
    endOfTrialPeriod
  };
  
