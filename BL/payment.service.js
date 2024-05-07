const { default: axios } = require("axios");
const userController = require("../DL/controllers/user.controller");
const planController = require("../DL/controllers/plan.controller");
const paymentController = require("../DL/controllers/payment.controller");
const TerminalNumber = 1000; //151048
const ApiName = "test9611"; //"CHpqcSCn4IbDRQMBhSB9"
//להוסיף בדיקה אם בנאדם נמצא באמצע מנוי הוא לא יכול לעבור לפה לזרוק לו שגיאה
//בהמשך מנויים ושידרוגים

async function sendRequstToCardkom(user, planId) {
  //להוסיף את הקישור לחבילה מהדאטא בייס שיביא לי מחיר ושם
  //ולהחזיר בתשובה גם את החבילה

  const plan = await planController.readOne({ _id: planId });

  const { email, name, phone, _id } = user;
  const body = {
    TerminalNumber: TerminalNumber,
    ApiName: ApiName,
    ReturnValue: _id, //מזהה עסקה יחודי שמקבלים חזרה
    Amount: "5050" ,// plan.price,
    SuccessRedirectUrl: "https://www.google.com", //לשים פה קישור לדף הצלחת העסקה
    FailedRedirectUrl: "https://www.yahoo.com", //קישור לדף כישלון
    WebHookUrl: "http://localhost:2500/payment/indicator", // פניה בשרת לקבלת פרטי העסקה לפני שהמשתמש מופנה לדף הצלחה וכישלון
    Document: {
      To: name,
      Email: email,
      Products: [
        {
          Description: plan.name,
          UnitCost:  "5050" ,//plan.price,
        },
      ],
    },
  };
  const res = await axios.post(
    "https://secure.cardcom.solutions/api/v11/LowProfile/Create",
    body
  );

  return { url: res.data.Url, plan: plan };

  //  לתפוס url של הסליקה ולשלוח לקיילנט שיפתח אותו בifrem
}

async function getIndicatorUrl() {
  console.log("in service########");
  const body = {
    TerminalNumber: TerminalNumber,
    ApiName: ApiName,
    LowProfileId: "string",
  };
  try {
    const res = await axios.post(
      "https://secure.cardcom.solutions/api/v11/LowProfile/GetLpResult",
      body
    );
    const plan = await planController.readOne({ price: res.data.Amount });
    const data = {
      user: res.data.ReturnValue,
      plan: plan._id,
      route: "month",
    };
    const payment = await paymentController.create(data);
    await userController.updateOne(
      { _id: data.user },
      { $push: { payments: payment._id }, $set:{subscription: plan._id} }
    );


  } catch (err) {
    res.status(444).send(err.msg);
  }
}

module.exports = {
  sendRequstToCardkom,
  getIndicatorUrl,
};

// {
//     "ResponseCode": 0,
//     "Description": "string",
//     "TerminalNumber": 0,
//     "LowProfileId": "string",
//     "TranzactionId": 0,
//     "ReturnValue": "string",
//     "Operation": "ChargeOnly",
//     "UIValues": {
//       "CardOwnerEmail": "string",
//       "CardOwnerName": "string",
//       "CardOwnerPhone": "string",
//       "CardOwnerIdentityNumber": "string",
//       "NumOfPayments": 0,
//       "CardYear": 0,
//       "CardMonth": 0,
//       "CustomFields": [
//         {
//           "Id": 1,
//           "Value": "string"
//         }
//       ]
//     },
//     "DocumentInfo": {
//       "ResponseCode": 0,
//       "Description": "string",
//       "DocumentType": "Error",
//       "DocumentNumber": 0,
//       "AccountId": 0,
//       "ForeignAccountNumber": "string",
//       "SiteUniqueId": "string"
//     },
//     "TokenInfo": {
//       "Token": "string",
//       "TokenExDate": "string",
//       "CardYear": 0,
//       "CardMonth": 0,
//       "TokenApprovalNumber": "string",
//       "CardOwnerIdentityNumber": "string"
//     },
//     "SuspendedInfo": {
//       "SuspendedDealId": 0
//     },
//     "TranzactionInfo": {
//       "ResponseCode": 0,
//       "Description": "string",
//       "TranzactionId": 0,
//       "TerminalNumber": 0,
//       "Amount": 0,
//       "CoinId": 0,
//       "CouponNumber": "string",
//       "CreateDate": "2019-08-24T14:15:22Z",
//       "Last4CardDigits": 0,
//       "Last4CardDigitsString": "string",
//       "FirstCardDigits": 0,
//       "JParameter": "string",
//       "CardMonth": 0,
//       "CardYear": 0,
//       "ApprovalNumber": "string",
//       "FirstPaymentAmount": 0,
//       "ConstPaymentAmount": 0,
//       "NumberOfPayments": 0,
//       "CardInfo": "Israeli",
//       "CardOwnerName": "string",
//       "CardOwnerPhone": "string",
//       "CardOwnerEmail": "string",
//       "CardOwnerIdentityNumber": "string",
//       "Token": "string",
//       "CardName": "string",
//       "SapakMutav": "string",
//       "Uid": "string",
//       "ConcentrationNumber": "string",
//       "DocumentNumber": 0,
//       "DocumentType": "Error",
//       "Rrn": "string",
//       "Brand": "PrivateCard",
//       "Acquire": "Unknown",
//       "Issuer": "NonIsrael",
//       "PaymentType": "Unknown",
//       "CardNumberEntryMode": "MagneticStip",
//       "DealType": "Information",
//       "IsRefund": true,
//       "CustomFields": [
//         {
//           "Id": 1,
//           "Value": "string"
//         }
//       ]
//     },
//     "ExternalPaymentVector": "string",
//     "Country": "string"
//   }
