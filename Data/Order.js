const mongoose = require("mongoose");
const Counter = require("./Counter");
const orderSchema = new mongoose.Schema({
  orderID: { type: String, unique: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  createdBy: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", async function (next) {
  if (!this.orderID) {
  
    const counter = await Counter.findOneAndUpdate(
      { name: "orders" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.orderID = `ORD${counter.value.toString().padStart(3, "0")}`; 
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
