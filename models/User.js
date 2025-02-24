


const mongoose = require('mongoose');
const Counter = require('./Counter')

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});


userSchema.pre("save", async function (next) {
  if (!this.id) {
    const counter = await Counter.findOneAndUpdate(
      { name: "users" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.value;
  }
  next();
});



module.exports = mongoose.model('User', userSchema);