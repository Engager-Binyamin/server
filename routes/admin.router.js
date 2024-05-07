const express = require("express");
const router = express.Router();
const accountService = require('../BL/account.service')


// get all users
router.get("/users", async (req, res) => {
  try {
    const users = accountService.getUsers();
    console.log('users', users);
    res.send(users);

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// get one user 
router.get("/users/:userId", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// update one user : change details, update plan manually
router.put("/users/:userId", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// delete one user
router.delete("users/:userId", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// Dashboard of admin
router.get("/dashboard", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});


module.exports = router;
