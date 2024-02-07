const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,

  },
  password: {
    type: String,
    // required: true,
    // אביעד אמר לא לעשות סיסמה חובה בגלל שאנשים נכנסים עם גוגל וכד'
    // select: false,

  },
  phone: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true
  },

  campaigns: [
    {
      campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaign",
      },
    },
  ],
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

