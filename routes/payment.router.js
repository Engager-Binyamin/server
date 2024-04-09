const express = require("express");
const router = express.Router();
const paymentService = require('../BL/payment.service')
const auth = require('../middlewares/auth')
const { mwToken } = require("../middlewares/auth");

router.get('/:planId',mwToken,   async (req, res) => {
try{
    console.log("***************************************");
    const planId = req.params.planId
    console.log({planId});
    console.log(req.body.user);
    const pay = await paymentService.sendRequstToCardkom(req.body.user, planId)
    res.send(pay);
}
catch(err){
    res.status(444).send(err.msg);
}


})

router.get('/indicator', async (req,res)=>{
    try{
        console.log("indi8888888888888888888888888888");
        const pay = await paymentService.getIndicatorUrl()
        res.send(pay);

    }catch(err){
        res.status(444).send(err.msg);
    }
} )



// אישור תשלום ראשוני indectorUrl
//לשים אותו בפיימנט סרוויס
//לקרוא לפונקציה שתחזיר לנו את כל הפרטי לקוח ולהכניס לדאטא בייס וטוקן
//לעדכן את הדאטא בייס של הלקוח אם התשלום קרה או לא קרה 


//ליצור מודל של payment docimnt
//מה רכש כמה עלה תאריך


module.exports= router
