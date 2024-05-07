// TODO:
// 1. auth - basic user
// 2. auth - admin
// 3. move login func to _______

const jwt = require("jsonwebtoken")
const userService = require('../BL/account.service');
const campaignController = require('../DL/controllers/campaign.controller')
const leadService = require('../BL/lead.service')
const bcrypt = require('bcrypt')


//LOGIN
async function login(email, password) {
    const user = await userService.getOneUserByEmail(email, "+password")
    // השוואה בין הססמא שהתקבלה בלוגין לבין הססמא המוצפנת
    const correctPass = bcrypt.compareSync(password, user.password);
    if (!correctPass) throw "The password incorrect"
    //  הפקת טוקן בכניסה
    const token = jwt.sign({ phone: user.phone }, process.env.SECRET, { expiresIn: "7d" })
    return { token, user }
}

// פונקציה לבדיקת טוקן בבקשות לקבלת מידע 
const userModel = require("../DL/models/user.model")

const mwToken = async (req, res, next) => {
    try {
        const originalToken = req.headers.authorization;
        if (!originalToken) throw "Unauthorized";

        const token = originalToken.replace("Bearer ", "");

        const payload = jwt.verify(token, process.env.SECRET);
        const user = await userModel.findOne({ phone: payload.phone })
        if (!user) throw { msg: "not permitted" }
        // const user = {
        //     _id: "65ed9c525b51ed6b4bd16107"
        // }
        req.body.user = user
        next()
    } catch (err) {
        res.status(401).send("Unauthorized")
    }
}

// פונקציית בדיקת הטוקן בעליית האפליקציה
async function tokenToUser(authorization) {
    try {
        const originalToken = authorization;
        if (!originalToken) throw "Unauthorized";

        const token = originalToken.replace("Bearer ", "");

        const payload = jwt.verify(token, process.env.SECRET);
        const data = await userModel.findOne({ phone: payload.phone });
        if (!data) throw { msg: "not permitted" };

        const user = {
            avatar: data.avatar,
            email: data.email,
            name: data.name,
            phone: data.phone,
            _id: data._id
        };
        // console.log('tokenToUser: ', user)
        return user;
    } catch (err) {
        res.status(401).send("Unauthorized")
    }
};

// tokenToUser({headers: {authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA1NDYzMzkyOTAiLCJpYXQiOjE3MTAzMjA3MDUsImV4cCI6MTcxMDkyNTUwNX0.70NzWGOmIIG2vhUE3hv8aapFUYBicZ3zGmS1PPFqJy0"}})

// יצירת טוקן
const createToken = async (campaignId, userId) => {
    const campaign = await campaignController.read({ _id: campaignId })
    if (!campaign) throw { msg: 'campaign not found' }
    let token = jwt.sign({ campaignId, userId }, process.env.SECRET)
    return token
}

// בדיקת טוקן 
const checkToken = async (token) => {
    try {
        const approval = jwt.verify(token, process.env.SECRET)
        if (!approval) throw { msg: 'token is not valid' }
        const campaign = await campaignController.read({ _id: approval.userId }, { _id: approval.campaignId })
        if (!campaign) throw { msg: 'campaign not found' }

        return approval
    } catch (error) {
        return error
    }
}


// שליחה להוספת לייד
const sendToAddLead = async (token, data) => {
    let res = await checkToken(token)
    const { campaignId, userId } = res
    return 'the lede create' + await leadService.addLeadToCamp(campaignId, userId, data.data, token)
}
module.exports = { createToken, sendToAddLead, login, mwToken, tokenToUser }

