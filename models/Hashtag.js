const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let hashtag = new Schema({
    hashtag: {
        type: String, 
        unique:true,
        index: true
    },
    likes:{
        type:Number,
        default:23
    },
    posts:[],
    comments:{
        type:Number,
        default:34
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Hashtag', hashtag);