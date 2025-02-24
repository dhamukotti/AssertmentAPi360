const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Counter = require('../models/Counter')

const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (password !== user.password) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password; 

      res.json({ message: "Login successful", user: userWithoutPassword, token });

  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


const registerUser = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
  
      const counter = await Counter.findOneAndUpdate(
        { name: "users" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
  
      
      const newUser = new User({
        id: counter.value,
        name,
        email,
        password,
        role,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getusers = async (req, res) => {
    try {
      const Userdata = await User.find();
      res.json(Userdata);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  const updateUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const { name, email, password, role } = req.body; 
  
      const updatedUser = await User.findOneAndUpdate(
        { id: parseInt(id) }, 
        { $set: { name, email, password, role } }, 
        { new: true, runValidators: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User updated successfully", user: updatedUser });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params; 
  
      console.log("Deleting user with ID:", id);
  
      const deletedUser = await User.findOneAndDelete({ id: Number(id) });
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User deleted successfully", user: deletedUser });
  
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
const logout = (req, res) => {
    res.json({ message: "Logout successful" });
};

module.exports = { login, logout,registerUser,getusers,updateUser,deleteUser };
