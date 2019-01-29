const jwt = require('jsonwebtoken');
const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
var objectId = require('mongodb').ObjectID;
const UserModel = require('../../models/User');
const sendGrid = require('../../services/sendgrid');
const QuestionModel = require('../../models/Question');
const Hashtag = require('../../models/Hashtag');
const PostModel = require('../../models/Post');


exports.get_question = async (req, res) => {
	/*=========== find random question ========= */
	let data = await QuestionModel.aggregate(
		[{
			$sample: {
				size: 1

			}
		}]
	)

	if (data) {
		responses.success(res, `Success`, data[0]);
	} else {
		responses.sendErrorMessage(res, "data not found");
	}
}


exports.popular_hashtag = async (req, res) => {
	/* ======= add field for total likes & total comment and then calculate total score of post======= */
	let popular_post = await Hashtag.aggregate([{
			$addFields: {
				totallike: {
					$sum: "$hashtag.post.like"
				},
				totalcomment: {
					$sum: "$hashtag.post.comment"
				}
			}
		},
		{
			$addFields: {
				totalScore: {
					$add: ["$totallike", "$totalcomment"]
				}
			}
		}

	]).sort({
		totalScore: -1
	})
	if (popular_post) {
		responses.success(res, `Success`, popular_post);
	} else {
		responses.sendErrorMessage(res, "data not found");
	}

}


/* =================== */
exports.createPost = async (req, res) => {
	try {
		if (req.body.hashtag_name) {
			try {
				req.body.hashtag_name = req.body.hashtag_name.split(',')
			} catch (err) {
				responses.sendErrorMessage(res, err.message);
			}

			Hashtag.find({
					hashtag: {
						$in: req.body.hashtag_name
					}
				})
				.then(async find_data => {
					let arr = [];
					find_data.forEach(e => {
						arr.push(e.hashtag)
					});
					let differenct_data = _.difference(req.body.hashtag_name, arr)
					console.log(differenct_data)
					if (differenct_data.length == 0) {
						postmethod()
					} else {
						let hash = []
						differenct_data.forEach(data => {
							hash.push({
								hashtag: data
							})
						})
						console.log(hash)
						let data = await Hashtag.insertMany(hash)
						if (data) {
							postmethod()
						} else {
							responses.sendErrorMessage(res, "something went wrong");
						}
					}
				}).catch(err => {
					responses.sendErrorMessage(res, err.message);
				})

		} else {
			postmethod()
		}



		async function postmethod() {
			if (req.files && req.files.image)
				req.body.image = await `/upload/postuploader/${req.files['image'][0].filename}`;
			console.log(req.body)

			if (req.files && req.files.video)
				req.body.video = await `/upload/postuploader/${req.files['video'][0].filename}`;
			let post_model = await new PostModel(req.body);
			let data = await post_model.save();

			await Hashtag.updateMany({
				hashtag: {
					$in: req.body.hashtag_name
				}
			}, {
				$push: {
					"posts": data._doc
				}
			})

			if (data) {
				responses.success(res, `Success`, data);
			} else {
				responses.sendErrorMessage(res, "something went wrong");
			}
		}



	} catch (err) {
		responses.sendErrorMessage(res, err.message);
	}
}

exports.searchHashtag = async (req, res) => {
	try {
		let searchQuery = req.body.query;
		if (searchQuery) {
			let hashtags = await Hashtag.find({
				hashtag: {
					$regex: searchQuery,
					$options: 'i'
				}
			});
			return responses.success(res, `Success`, hashtags);
		}

		responses.success(res, `Success`, []);

	} catch (e) {
		responses.sendErrorMessage(res, err.message);
	}
}


exports.likePost = async (req, res) => {
	try {
		let post_id = req.params.id;
		let author_id = req.userDetail._id;
		let likeModel = req.models.Like;
		let postModel = req.models.Post;


		let like = await likeModel.findOne({
			post_id: post_id,
			author_id: author_id
		});

			if (like) {
			await likeModel.findByIdAndRemove(like._id);
			await postModel.findByIdAndUpdate(post_id, {
				$inc: {"likes":-1}
			})
			return responses.success(res, 'Post Unliked', {});
		}

		await likeModel.create({
			post_id,
			author_id: author_id
		});

		await postModel.findByIdAndUpdate(post_id, {
			$inc: {
				"likes": 1
			}
		});

		responses.success(res, 'Success', {});


	} catch (e) {
		console.log("************* Error while updating post**********", e);
		responses.sendErrorMessage(res, 'Error while liking the post');
	}
}

exports.commentPost = async (req, res) => {
	try {
		let post_id = req.params.id;
		let author_id = req.userDetail._id;
		let commentModel = req.models.Comment;
		let postModel = req.models.Post;
		let commentText = req.body.text;


		let comment = await commentModel.create({
			post_id: post_id,
			author: author_id,
			text: commentText
		});

		await postModel.findByIdAndUpdate(post_id, {
			$inc: {
				"comments": 1
			}
		});

		responses.success(res, 'Comment successfully posted', comment);
	} catch (e) {
		console.log('******** Error While commenting', e);
		responses.sendErrorMessage(res, 'Error while commenting on the post');
	}
}

