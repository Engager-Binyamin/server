const express = require("express");
const router = express.Router();
const accountService = require('../BL/account.service')
const userController = require('../DL/controllers/user.controller')
const userService = require('../BL/account.service')
const userModel = require('../DL/models/user.model')
const jwt = require("jsonwebtoken");
const { tokenToUser } = require("../middlewares/auth");

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
      // Redirect the user to the registration page if they're not registered
      return res.redirect("http://localhost:5173/user-doesnt-exists");
    } else if (!userToReturn.phone) {
      // Redirect the user to complete their details if phone number is missing
      return res.redirect(`http://localhost:5173/completeDetails/${userToReturn.email}`);
    }

    const token = jwt.sign(
      { email: googleUser.res.email, userType: userToReturn.userType, _id: userToReturn._id },
      process.env.SECRET,
      { expiresIn: "1h" }
    )

    return res.redirect(`${baseUrlClient}/redircetGoogle/${token}`)

  } catch (err) {
    console.log(err);
  }
});

router.get("/signUpGoogle", async (req, res) => {
  try {

    const code = req.query.code;
    // let userToReturn = {}

    const { id_token, access_token } = await accountService.getGoogleOAuthTokens({
      code,
      redirect_uri: `${baseUrlServer}/accout/signUpGoogle`
    });

    const googleUser = await accountService.getGoogleUser({
      id_token,
      access_token,
    });
    console.log("userrrrrrrrrShakeddddddddd", googleUser.res);

    if (!googleUser.res.verified_email) throw { msg: 'forbiden', code: 403 }
    const userInDataBase = await accountService.getOneUserByEmail(googleUser.res.email)
    console.log("lalalalalal");
    if (!userInDataBase) {
    let userToReturn = await userModel.create({
        name: googleUser.res.name,
        email: googleUser.res.email
      })
      console.log("userrrrrrrrr", userToReturn);
      return res.redirect(`${baseUrlClient}/completeDetails/${userToReturn.email}`);
    }
    if (!userInDataBase.phone) {
      return res.redirect(`${baseUrlClient}/completeDetails/${userToReturn.email}`);
    } else {
      const token = jwt.sign(
        { email: googleUser.res.email, userType: userToReturn.userType, _id: userToReturn._id },
        process.env.SECRET,
        { expiresIn: "1h" }
      )
      return res.redirect(`http://localhost:5173/redircetGoogle/${token}`)
    }
  } catch (err) {
    res
      .status(err.code || 500)
      .send("something went wrong")
    // .send({ msg: err.msg || "something went wrong" });
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

// dashboard  - מידע על חבילה, נתוני לידים והודעות, פרטים אישיים
router.get("/dashboard", async (req, res) => {
  try {

  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || "something went wrong" });
  }
});

// בדיקת הטוקן והחזרת היוזר כשאפליקציה עולה לראשונה
router.get("/tokenToUser", async (req, res) => {
  try {
    let user = await tokenToUser(req.headers.authorization);
    res.send(user);
  } catch (err) {
    res
      .status(err.code || 500)
      .send({ msg: err.msg || err.message || "something went wrong" });
  }
});

module.exports = router;
