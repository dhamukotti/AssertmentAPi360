const Order = require("../models/Order");
const Counter = require("../models/Counter");
const orderhistory = require("../models/orderhistory");

const createOrder = async (req, res) => {
  try {
    const { product, quantity, status, priority, createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ message: "createdBy is required" });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "orders" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newOrder = new Order({
      orderID: `ORD${counter.value.toString().padStart(3, "0")}`,
      product,
      quantity,
      status,
      priority,
      createdBy,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", orderID: newOrder.orderID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { product, quantity, status, priority, } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, {product, status,quantity, priority, updatedAt: Date.now() }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
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

    const orders = await Order.find({
      product: searchQuery, 
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

const getoneorder = async (req, res) => {
  try {
    let { createdBy } = req.query;

    // Convert createdBy to a number if needed
    if (!isNaN(createdBy)) {
      createdBy = Number(createdBy);
    }

    const orders = await Order.find({ createdBy });

    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getordersbyid = async (req, res) => {
  const { id } = req.params; 
 
   try {
     const order = await orderhistory.find({ orderID: id });
 
     if (!order) {
       return res.status(404).json({ message: "Order not found" });
     }
 
     res.json(order);   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error", error: error.message });
   }
};
const getOrdersfordashboard = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status", 
          count: { $sum: 1 } 
        }
      }
    ]);

    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    // Populate the counts based on the aggregated data
    statusCounts.forEach((statusCount) => {
      if (statusCount._id === "Pending") {
        counts.pending = statusCount.count;
      } else if (statusCount._id === "In Progress") {
        counts.inProgress = statusCount.count;
      } else if (statusCount._id === "Completed") {
        counts.completed = statusCount.count;
      }
    });

    // Return only the status counts
    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrdersfordashboardfilter = async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query;

    const matchFilter = {};

    if (status && status !== "all") {
      matchFilter.status = status;
    }

    if (fromDate && toDate) {
      matchFilter.createdAt = {
        $gte: new Date(fromDate), 
        $lte: new Date(toDate),  
      };
    }

    const statusCounts = await Order.aggregate([
      {
        $match: matchFilter, // Apply the filter
      },
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count orders in each group
        },
      },
    ]);

    // Initialize counts object
    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    // Populate the counts based on the aggregated data
    statusCounts.forEach((statusCount) => {
      if (statusCount._id === "Pending") {
        counts.pending = statusCount.count;
      } else if (statusCount._id === "In Progress") {
        counts.inProgress = statusCount.count;
      } else if (statusCount._id === "Completed") {
        counts.completed = statusCount.count;
      }
    });

    // Return the status counts
    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getOrdersForDashboardFilterUser = async (req, res) => {
  try {
    const { status, fromDate, toDate, createdBy } = req.query;

    const matchFilter = {};

    if (status && status !== "all") {
      matchFilter.status = status;
    }

    if (fromDate && toDate) {
      matchFilter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if (createdBy) {
      matchFilter.createdBy = Number(createdBy);
    }

    const statusCounts = await Order.aggregate([
      {
        $match: matchFilter, // Apply the filter
      },
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count orders in each group
        },
      },
    ]);

    // Initialize counts object
    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    // Populate the counts based on the aggregated data
    statusCounts.forEach((statusCount) => {
      if (statusCount._id === "Pending") {
        counts.pending = statusCount.count;
      } else if (statusCount._id === "In Progress") {
        counts.inProgress = statusCount.count;
      } else if (statusCount._id === "Completed") {
        counts.completed = statusCount.count;
      }
    });

    // Return the status counts
    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrdersfordashboarduser = async (req, res) => {
  try {
    let { createdBy } = req.query;
    if (!createdBy) {
      return res.status(400).json({ message: "createdBy parameter is required" });
    }
    if (!isNaN(createdBy)) {
      createdBy = Number(createdBy);
    }
    const statusCounts = await Order.aggregate([
      { $match: { createdBy } }, 
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    statusCounts.forEach((statusCount) => {
      const statusKey = statusCount._id.toLowerCase().replace(/\s/g, ""); // Normalize keys
      if (counts.hasOwnProperty(statusKey)) {
        counts[statusKey] = statusCount.count;
      }
    });

    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getdashboardOrders = async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query;

    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate), 
        $lte: new Date(toDate),   
      };
    }

    const orders = await Order.find(filter);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getdashboardOrdersuser = async (req, res) => {
  try {
    const { status, fromDate, toDate,createdBy } = req.query;

    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate), 
        $lte: new Date(toDate),  

      };
    }
    if (createdBy) {
      filter.createdBy = createdBy;
    }

    const orders = await Order.find(filter);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
   createOrder,
   getordersbyid,
   getdashboardOrders, 
   getOrders,
   getoneorder,
   getdashboardOrdersuser,
    updateOrder,
    getOrdersfordashboarduser,
     deleteOrder,orderstatus,getOrdersfordashboard, 
     getOrdersfordashboardfilter,
     getOrdersForDashboardFilterUser
     
    };
