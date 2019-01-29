const express = require('express');
const router = express.Router();
const dataController = require('../../controllers/data/dataController');
const uploader = require('../../middleware/fileuploader');

router.route('/media/images')
    .get(dataController.getAllImages);

router.route('/media/gifs')
    .get(dataController.getAllGifs);

router.route('/media/videos')
    .get(dataController.getAllVideo)


exports.Router = router;