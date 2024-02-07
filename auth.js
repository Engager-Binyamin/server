const jwt = require("jsonwebtoken")
const userService = require('./BL/user.service');

async function login(phone, password) {
    const user = await userService.getOneUser(phone)
    console.log(user)
    if (password != user.password) throw "The password incorrect"
    //  הפקת טוקן בכניסה
    const token = jwt.sign({ phone: phone }, process.env.SECRET, { expiresIn: "7d" })
    return token
}
// פונקציה לבדיקת טוקן בבקשות לקבלת מידע 

const userModel = require("./DL/models/user.model")

const checkClient = async (req, res, next) => {
    try {
        const token = req.header("authorization").replace("Bearer ", "")
        if (!token) throw ({ msg: "no token sent" })
        const payload = checkToken(token)
        const user = await userModel.findOne({ phone: payload.phone })
        if (!user) throw { msg: "not permitted" }
        req.user = user
        next()
    } catch (err) {
        res.status(401).send("Unauthorized")
    }
}

const checkToken = (token) => {

    const payload = jwt.verify(token, process.env.SECRET)
    return payload
}


module.exports = { login, checkClient }