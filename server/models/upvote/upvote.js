const user = require("../user/user");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpvoteSchema = mongoose.Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: user
    }
});

module.exports = mongoose.model("upvote", UpvoteSchema);
