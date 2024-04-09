const express = require("express");
const router = express.Router();
const leadServices = require('../BL/lead.service')
const jwt = require("jsonwebtoken")


// new lead by webhook from landing-page
router.post("/webhook/:token", async (req, res) => {
    try {
      
      const payload = jwt.verify(req.params.token, process.env.SECRET);
      const userId = payload.userId
      const campId = payload.campaignId

      let result = await leadServices.addLeadToCamp(campId, userId,req.body)
      res.send(result)
    } catch (err) {
      res
        .status(err.code || 500)
        .send({ msg: err.msg || "something went wrong" });
    }
  });

// refresh webhook
router.post("/refresh/:campId", async (req, res) => {
    try {
  
    } catch (err) {
      res
        .status(err.code || 500)
        .send({ msg: err.msg || "something went wrong" });
    }
  });

module.exports = router;
