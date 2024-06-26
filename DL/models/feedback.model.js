const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const feedbackModel = mongoose.model("feedback", feedbackSchema);
module.exports = feedbackModel;
