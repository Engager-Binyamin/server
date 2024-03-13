const express = require("express");
const router = express.Router();
const accountService = require('../BL/account.service')
const userController = require('../DL/controllers/user.controller')
const userModel = require('../DL/models/user.model')
const jwt = require("jsonwebtoken")

const baseUrlClient = process.env.BASE_URL_CLIENT;
const baseUrlServer = process.env.BASE_URL_SERVER;


router.post("/signin", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

router.get("/signInGoogle", async (req, res) => {
  try {
    const code = req.query.code;
    const { id_token, access_token } = await accountService.getGoogleOAuthTokens({
      code,
      redirect_uri: `${baseUrlServer}/accout/signInGoogle`,
    });
    const googleUser = await accountService.getGoogleUser({
      id_token,
      access_token,
    });

    if (!googleUser.res.verified_email) {
      throw new Error("Google user email is not verified.");
    }

    let userToReturn = await userModel.findOne({ email: googleUser.res.email });
    if (!userToReturn) {

      userToReturn = await userController.create({
        name: googleUser.res.name,
        email: googleUser.res.email
      })

    }
    if (!userToReturn.phone) {
      return res.redirect(`${baseUrlClient}/completeDetails/${userToReturn.email}`);
    }

    const token = jwt.sign(
      { email: googleUser.res.email, userType: userToReturn.userType, _id: userToReturn._id },
      process.env.SECRET,
      { expiresIn: "1h" }
    )

    res.redirect(`${baseUrlClient}/redircetGoogle/${token}`)

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

router.get("/signUpGoogle", async (req, res) => {
  try {

    const code = req.query.code;
    let userToReturn = {}

    const { id_token, access_token } = await accountService.getGoogleOAuthTokens({
      code,
      redirect_uri: `${baseUrlServer}/accout/signUpGoogle`,
    });

    const googleUser = await accountService.getGoogleUser({
      id_token,
      access_token,
    });

    if (!googleUser.res.verified_email) throw { msg: 'forbiden', code: 403 }

    userToReturn = await userController.create({
      name: googleUser.res.name,
      email: googleUser.res.email
    })


    if (!userToReturn.phone) {
      return res.redirect(`${baseUrlClient}/completeDetails/${userToReturn.email}/${userToReturn.name}`);
    }

    // res.redirect(`${ba6seUrlClient}/login`)


  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

router.post("/signup", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// renew password - שינוי סיסמא
router.post("/renew", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// reset password - איפוס סיסמא
router.post("/restore", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// feedback - פידבק
router.post("/feedback", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// dashboard  - מידע על חבילה, נתוני לידים והודעות, פרטים אישיים
router.get("/dashboard", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

module.exports = router;
