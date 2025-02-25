const mongoose = require("mongoose");

const orderhistorySchema = new mongoose.Schema({
  orderID: { type: String, required: true }, 
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  createdBy: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, require:true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Orderhistory", orderhistorySchema);
