const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/auth');


router.route('/login')
    .post(adminAuthController.login);

router.route('/forgetPassword')
    .post(adminAuthController.forgetPassword);

router.route('/passwordResetRequest')
    .post(adminAuthController.passwordResetRequest);




exports.Router = router;