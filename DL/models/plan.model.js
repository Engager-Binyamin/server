const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  max_num_leads: Number,
  leads_from_webhook: Boolean,
  contact_management_interface: Boolean,
  num_leads_in_list: Number,
  opening_msg_to_new_lids : Number,
  msg_number : Number,
  uploading_file_list : Boolean,
  data_transfer_crm : Boolean,
  split_terminals : Boolean,
  notification_new_lead : Boolean,
  copywriting_msg : Boolean ,
  connection_to_whatsApp : Boolean ,
  customer_journey : Boolean ,
  technical_support : Boolean,
  update_version : Boolean,
});
const planModel = mongoose.model("plan", planSchema);
module.exports = planModel;