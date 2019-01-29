const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/admin');

router.route('/getAllUsers')
      .get(adminController.getAllUsers);

router.route('/getAllAnonymousUsers')
      .get(adminController.getAllAnonymousUsers);

router.route('profile/:id')
      .get(adminController.getAdminProfile)
      .put(adminController.updateAdminProfile)