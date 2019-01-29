const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/user');
const uploader= require('../../middleware/fileuploader');

router.route('/getquestion')
    .get(userController.get_question);

router.route('/popularHashtag')
    .get(userController.popular_hashtag);

router.route('/createpost')
    .post(uploader,userController.createPost);

router.route('/like/post/:id')
      .post(userController.likePost);

router.route('/comment/post/:id')
      .post(userController.commentPost);

router.route('/searchHashtags')
     .post(userController.searchHashtag);



exports.Router = router;