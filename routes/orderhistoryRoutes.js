const express = require('express');
const { createorderhistory,getOrdershitory,deleteOrderhistory ,orderstatus,getOrdershistoryone } = require('../Controller/orderhistorycontroller');

const router = express.Router();
const {authMiddleware}= require('../middleware/authMiddleware')

router.post('/createorderhistory',authMiddleware,createorderhistory);
router.get('/getallorderhistory',authMiddleware,getOrdershitory)
router.get('/Getoneorderhistory',authMiddleware,getOrdershistoryone)
router.delete('/deleteorderhistory/:id',authMiddleware, deleteOrderhistory);
router.get("/Getordersearchvalue",authMiddleware, orderstatus);
module.exports = router;