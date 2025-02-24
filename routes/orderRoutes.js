const express = require('express');
     
     const { createOrder,getOrdersForDashboardFilterUser, getOrders,getordersbyid,getOrdersfordashboardfilter,getdashboardOrdersuser, updateOrder,getoneorder,getdashboardOrders, deleteOrder,orderstatus ,getOrdersfordashboard,getOrdersfordashboarduser,} = require('../Controller/ordercontroller');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/createorder',authMiddleware,createOrder);
router.get('/orders',authMiddleware, getOrders);
router.put('/updateorder/:id',authMiddleware,  updateOrder);
router.delete('/deleteorder/:id',authMiddleware, deleteOrder);
router.get("/Getordersearch",authMiddleware, orderstatus);
router.get('/Getoneorders',authMiddleware,getoneorder)
router.get('/Getoneordersbyid/:id',authMiddleware,getordersbyid)

// dashboard
router.get('/getallorderdashboard',authMiddleware,getOrdersfordashboard)
router.get('/getallorderdashboardfilter',authMiddleware,getOrdersfordashboardfilter)
router.get('/getallorderdashboardfilteruser',authMiddleware,getOrdersForDashboardFilterUser)

router.get('/getallorderdashboarduser',authMiddleware,getOrdersfordashboarduser)
router.get('/getreportfilter',authMiddleware,getdashboardOrders)
router.get('/getreportfilteruser',authMiddleware,getdashboardOrdersuser)
module.exports = router;