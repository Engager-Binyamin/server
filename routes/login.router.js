const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")
const jwt = require("jsonwebtoken")
const userService = require('../BL/account.service')

router.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const email = req.body.email?.trim()
        const password = req.body.password
        console.log(email, password)
        const login = await auth.login(email, password);

        res.send(login)

    } catch (err) {
        console.log(err)
        // res.status(401).send("something went wrong");
        res.status((err.code) || 401).send({ msg: err.msg || 'something went wrong' });

    }
})

//Login after account confirmation
router.post("/confirmed", async (req, res) => {
    try {
        const phone = req.body.phone
        const user = await userService.getOneUser(phone)
        const token = jwt.sign({ phone: phone }, process.env.SECRET, { expiresIn: "7d" })
        res.send({ token, user })
    } catch (err) {
        console.log('why get this??', err);
        res.status((err.code) || 401).send({ msg: err.msg || 'something went wrong' });
    }
})




module.exports = router
