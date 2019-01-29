const multer = require('multer');
const path = require('path');
const md5 = require('md5');


const uploader = async (req, res, next) => {

    var options = await multer.diskStorage({
        destination: path.join(__dirname, '../public/upload/postuploader'),
        filename: function (req, file, cb) {
            cb(null, (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));

        }
    });

    var upload = await multer({
        storage: options
    })

    await upload.fields([{
        name: 'image',
        maxCount: 5
    }, {
        name: 'video',
        maxCount: 1
    }])(req, res, next);


}


module.exports = uploader