const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let post = new Schema({
   text:{type:String,default:""},
   image: {
       type: String,
       default: ""
   },
   video: {
       type: String,
       default: ""
   },
   text_color: {
       type: String,
       default: ""
   },
   bg_color: {
       type: String,
       default: ""
   },
   font_size: {
       type: String,
       default: ""
   },
   font_family: {
       type: String,
       default: ""
   },
   text_style: {
       type: String,
       default: ""
   },
   emoji_code: {
       type: String,
       default: ""
   },
   co_ordinate: {
       type: String,
       default: ""
   },
   hashtag_name:[],
   likes:{
       type:Number,
       default:0
   },
   comments:{
       type:Number,
       default:0
   }

}, {
    timestamps: true
});

module.exports = mongoose.model('post', post);