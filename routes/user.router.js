const express = require("express");
const router = express.Router();
const userService = require('../BL/account.service');
const campaignService = require('../BL/campaign.service');
 
const auth = require("../middlewares/auth")


// add new user:
router.post('/', async (req, res) => {
  try {

    const body = req.body
    const answer = await userService.createNewUser(body);
    res.send(answer);
  }
  catch (err) {
    console.log(err);
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
})

router.use(auth.checkClient)


// get all users
router.get("/", async (req, res) => {
  try {
    console.log(req.body);
    const users = await userService.getUsers();
    console.log("r", users)
    res.send(users)

  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
})

// get one user:
router.get("/:phone", async (req, res) => {
  try {
    console.log(req.params.phone);
    const phone = req.params.phone;
    const user = await userService.getOneUser(phone);
    console.log("r", user)
    res.send(user)

  } catch (err) {
    console.log(err);
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
})




router.put("/update/:email", async (req, res) => {
  try {
    const email = req.params.email
    const { phone } = req.body

const checkUser = await userService.getOneUserByEmail(email)
if(!checkUser) throw new Error ("user not found")

    const user = await userService.updatePhoneUser(email, { phone });
    //להביא את היוזר המלא ולקחת משם את האימייל ואידי המונגואי ולשים את הקוד של טל שזה יצירת טוקן, ושליחת לינק לפלאפון שמפעיל את היוזר
    res.send(user)

  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
})


// update one user:
router.put("/:phone", async (req, res) => {
  try {
    const phone = req.params.phone
    const data = req.body
    console.log("update phone:", phone)
    console.log("update data:", data)
    const user = await userService.updateOneUser(phone, data);
    console.log("r", user)
    res.send(user)

  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
})

// delete one user:
router.delete("/:phone", async (req, res) => {
  try {
    console.log(req.params.phone)
    const phone = req.params.phone
    const user = await userService.del(phone);
    console.log("r", user)
    res.send(user)

  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
})

//get Leads From All Campaigns
router.get('/:userId/leads', async (req, res) => {
  try {
const userId= req.params.userId
const campaigns = await campaignService.getAllCampaignsByUser(userId)
const leadsArr =[]
let camp = ""
campaigns.forEach(campaign => {
  campaign.leads = campaign.leads.filter(lead => lead.isActive);
  camp = campaign
  console.log("campaign",campaign.leads);
  const mappedLeads = campaign.leads.map(lead => ({
    name: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    notes: lead.notes,
    joinDate: lead.joinDate,
    campaign: camp
  }));

  leadsArr.push(...mappedLeads);
})
console.log(leadsArr);
  console.log("88888888____________888888888",leads);
    // מידע זמני

    // const heads = [
    //   { title: 'name', input: 'text' },
    //   { title: 'email', input: 'text' },
    //   { title: 'phone', input: 'text' },
    //   { title: 'joinDate', input: 'date' },
    //   { title: 'campaign', input: 'select', inputValues: ["קורס תפירה", "חדר כושר", "בריכה עירונית"] },
    //   { title: 'isOnline', input: '' },
    // ]

    res.send({ leads: formatTempLeads, heads });

  } catch (err) {
    res.status(err.code || 500).send({ msg: err.msg || 'something went wrong' });
  }
})

// ייצוא הראוטר
module.exports = router;
