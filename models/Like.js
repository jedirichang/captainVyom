const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const like = new Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('like', like);