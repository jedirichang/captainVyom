const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let admin = new Schema({
    username: {
        type: String,
        index: {
            unique: true
        }
    },
    password: String,
    createdAt: Number,
    createdAtIso: Date,
    gender: String,
    email: String,
    unique_id: String,
    isAdmin:{type:Boolean,default:true},
    access_token: String,
    resetPasswordExpires:String,
    resetPasswordToken:String
});
module.exports = mongoose.model('Admin', admin);
