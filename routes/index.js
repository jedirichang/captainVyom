const express = require('express');
const router = express.Router();
//const userAuthMiddleware = require('../middlewares/userAuth');
const userAuthMiddleware  = require('../middleware/auth/user')

//Routes
const userAuth = require('./users/auth').Router;
const adminAuth = require('./admin/auth').Router;
const user = require('./users/userRoute').Router;
const dataRoutes=require('./data/dataRoutes').Router


//Auth Related Routes.
router.use('/user/auth', userAuth);
router.use('/admin/auth', adminAuth);

//Routes related to user activities.
router.use('/user',userAuthMiddleware, user);

//Data Routes
router.use('/data',userAuthMiddleware,dataRoutes)


module.exports = router;
