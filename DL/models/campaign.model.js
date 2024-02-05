const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  leads: [
    {
      lead: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "lead",
        required: true,
      },
      receptionDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["sent", "recieved"],
        default: "sent"
      }
    },
  ],
  status:{
    type : String,
    default: "created"
  }
});

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    default: "65ba97e536d6af41e9beb0d1",
  },
  title: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  msg: [msgSchema],

  leads: [
    {
      lead: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'lead',
        required: true,
      },
      joinDate: {
        type: Date,
        default: Date.now,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  }
});

const campaignModel = mongoose.model("campaign", campaignSchema);
module.exports = campaignModel;
