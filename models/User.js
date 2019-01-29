const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let user = new Schema({
    username:{type:String, index: {unique:true}},
    password:String,
    createdAt:Number,
    createdAtIso:Date,
    gender:String,
    email:String,
    unique_id:String,
    is_anonymous:Boolean,
    access_token:String
});
module.exports = mongoose.model('User', user);
