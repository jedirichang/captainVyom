const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let media = new Schema({
    type:String, // image,video,gif
    destination:String
});
module.exports = mongoose.model('media', media);
