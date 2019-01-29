const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
var objectId = require('mongodb').ObjectID;

exports.getAllImages = async (req, res) => {
    try {
        let mediaModel = req.models.Media;
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        let medias = await mediaModel
            .find({
                type: 'image'
            })
            .skip(page * limit)
            .limit(limit);
        responses.success(res, 'Successfully fetched images', medias);
    } catch (e) {
        console.log('*****Error', e);
        responses.sendErrorMessage(res, 'Error while fetching images');
    }

}

exports.getAllGifs = async (req, res) => {
    try {
       let mediaModel = req.models.Media;
       let page = parseInt(req.query.page);
       let limit = parseInt(req.query.limit);


        let medias = await mediaModel
            .find({
                type: 'gif'
            })
            .skip(page * limit)
            .limit(limit);
        responses.success(res, 'Successfully fetched gifs', medias);
    } catch (e) {
        console.log('*****Error', e);
        responses.sendErrorMessage(res, 'Error while fetching gifs');
    }

}

exports.getAllVideo = async (req, res) => {
    try {
         let mediaModel = req.models.Media;
         let page = parseInt(req.query.page);
         let limit = parseInt(req.query.limit);


        let medias = await mediaModel
            .find({
                type: 'video'
            })
            .skip(page * limit)
            .limit(limit);
        responses.success(res, 'Successfully fetched videos', medias);
    } catch (e) {
        console.log('*****Error', e);
        responses.sendErrorMessage(res, 'Error while fetching videos');
    }
}