// בהתחלה ניסה לעשות תשלום ואז עדכון עם הפרטים
// סוג חבילה[

//     מסלול שנתי או חודשי
    
//     יוזר שקנה
//     תאריך 
// ]

const mongoose = require('mongoose')
const paymentSchema = new mongoose.Schema({

  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date:
    {
        type: Date,
        default: Date.now
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plan'
    },
    route:{
        type: String, 
        enum :  [ "month", "year"]
    }


})

const paymentModel = mongoose.model('payment', paymentSchema)
module.exports = paymentModel;