const express = require("express");
const router = express.Router();
const plansService = require('../BL/plans.service')





router.get('/', async (req, res) => {
    try {

        const plans = await plansService.readPlan()
        console.log(plans);
        if (!plans) res.status(404).send({ msg: "Plans not found" })
        res.send(plans)
    }

    catch (err) {
        console.error(err);
        res.status(err.code || 500).send({ msg: err.msg || "Something went wrong" });
    }
})



module.exports = router;