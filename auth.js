const jwt = require("jsonwebtoken")
const userService = require('./BL/user.service');

async function login(phone, password) {
    const user = await userService.getOneUser(phone)
    console.log(user)
    if (password != user.password) throw "The password incorrect"
    //  הפקת טוקן בכניסה
    const token = jwt.sign({ phone: phone }, process.env.SECRET, { expiresIn: "7d" })
    return {token,user}
}
// פונקציה לבדיקת טוקן בבקשות לקבלת מידע 
const userModel = require("./DL/models/user.model")

const checkClient = async (req, res, next) => {
    try {
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA1NTk2MTk0MTMiLCJpYXQiOjE3MDcyOTY1MTksImV4cCI6MTcwNzkwMTMxOX0.9UKZmT-bI8eEpOGD5HJDLtfK6DBkdDn1pR85U9x2LKY"
        const token = req.header("authorization")
        if (!token) throw ({ msg: "no token sent" })
        const payload = checkToken(token)
        const user = await userModel.findOne({ phone: payload.phone })
        if (!user) throw { msg: "not permitted" }
        req.body.user = user
        next()
    } catch (err) {
        console.log({err});
        res.status(401).send("Unauthorized")
    }
}

const checkToken = (token) => {

    const payload = jwt.verify(token, process.env.SECRET)
    return payload
}


module.exports = { login, checkClient }