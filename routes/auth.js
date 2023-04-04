const express= require('express');
const { register, login,getMe,forgotPassword, resetPassword, updateDetails, updatePassword,logout } = require('../controller/auth');
const { protect } = require('../middleware/auth');
const router= express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect,getMe)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
router.route('/updatedetails').put( protect,updateDetails)
router.route('/updatepassword').put( protect,updatePassword)
router.route('/logout').get( logout)

module.exports=router;  