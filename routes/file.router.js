const express = require("express");
const router = express.Router();

// download leads as table + details
router.get("/download/leads", async (req, res) => {
    try {
  
    } catch (err) {
      res
        .status(err.code || 500)
        .send({ msg: err.msg || "something went wrong" });
    }
  });

// upload/leads - העלאת קובץ CSV 
router.post("/upload/leads", async (req, res) => {
    try {
  
    } catch (err) {
      res
        .status(err.code || 500)
        .send({ msg: err.msg || "something went wrong" });
    }
  });

module.exports = router;