const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let question = new Schema({
    ques:String,
   
},{
    timestamps:true
});

module.exports = mongoose.model('Question', question);
