const express = require('express');
const router = express.Router();
const userAuthController=require('../../controllers/users/auth');


router.route('/signup')
      .post(userAuthController.signup);

router.route('/signup/anonymous')
      .post(userAuthController.sign_in_anonymity);

router.route('/create/anonymous')
      .post(userAuthController.createNewAnonymousUser)

router.route('/login')
      .post(userAuthController.login);

router.route('/username/exists')
      .post(userAuthController.usernameExists);
    
router.route('/email/verification')
      .post(userAuthController.emailVerification);

router.route('/forget/password')
      .post(userAuthController.forgetPassword);

exports.Router = router;