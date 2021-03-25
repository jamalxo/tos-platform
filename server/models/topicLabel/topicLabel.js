const mongoose = require("mongoose");
const comment = require("../comment/comment");
const user = require("../user/user");
const upvote = require("../upvote/upvote");
const Schema = mongoose.Schema;

const TopicLabelSchema = mongoose.Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: comment
    }],
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: upvote
    }]
});

module.exports = mongoose.model("topicLabel", TopicLabelSchema);
