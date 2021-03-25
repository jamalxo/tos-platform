const user = require("../user/user");
const upvote = require("../upvote/upvote");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: user
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: upvote
    }]
});

module.exports = mongoose.model("comment", CommentSchema);
