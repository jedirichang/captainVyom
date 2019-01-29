const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    is_parent: {
        type: Boolean,
        default: true
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    },
    is_children: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text:String
}, {
    timestamps: true
});

module.exports = mongoose.model('comment', comment);