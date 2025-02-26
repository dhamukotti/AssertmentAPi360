const express = require('express');
const { login,getusers,updateUser, logout,registerUser,deleteUser} = 
require('../Controller/authcontroller'); 
const {authMiddleware}= require('../middleware/authMiddleware')
const router = express.Router();



router.post('/login', login);
router.get('/Getalluser',authMiddleware,getusers)
router.put('/Updateuser/:id',authMiddleware, updateUser);
router.post('/Register',authMiddleware, registerUser);
router.delete('/UserDelete/:id', authMiddleware, deleteUser);
router.post('/logout', logout);


module.exports = router;
