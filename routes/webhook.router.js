const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")
// יצירת טוקן
router.post('/', async (req, res) => {
    try {
        res.send(await auth.createToken(req.body.campId, req.body.userId))
    } catch (error) {
        console.log(error);
        res.status(543).send(error.msg)
    }
})



module.exports = router

