const orderhistory = require("../models/orderhistory");
const Orderhistory = require("../models/orderhistory");


const createorderhistory = async (req, res) => {
    try {
      const { orderID, product, quantity, status, priority, createdBy,createdAt } = req.body;
  
      if (!orderID) {
        return res.status(400).json({ message: "orderID is required" });
      }
  
      if (!createdBy) {
        return res.status(400).json({ message: "createdBy is required" });
      }
  
      const newOrder = new Orderhistory({
        orderID,
        product,
        quantity,
        status,
        priority,
        createdBy,
        createdAt
      });
  
      await newOrder.save();
  
      res.status(201).json({ message: "Order created successfully", orderID: newOrder.orderID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getOrdershitory = async (req, res) => {
  try {
    const orders = await Orderhistory.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrdershistoryone = async (req, res) => {
  try {
    let { createdBy } = req.query;

    if (!isNaN(createdBy)) {
      createdBy = Number(createdBy);
    }

    const orders = await Orderhistory.find({ createdBy });

    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const orderstatus = async (req, res) => {
  try {
    let searchQuery = req.query.search || "";

    searchQuery = searchQuery.replace(/['"]+/g, "").trim(); 

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const orders = await Orderhistory.find({
      orderID: searchQuery, 
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No matching products found" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteOrderhistory = async (req, res) => {
  const { id } = req.params; 

  try {
    const order = await orderhistory.deleteMany({ orderID: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createorderhistory,getOrdershitory,getOrdershistoryone,orderstatus,deleteOrderhistory };
