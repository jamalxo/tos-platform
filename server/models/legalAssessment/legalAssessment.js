const mongoose = require("mongoose");
const user = require("../user/user");
const comment = require("../comment/comment");
const upvote = require("../upvote/upvote");
const Schema = mongoose.Schema;

const LegalAssessmentSchema = mongoose.Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    legal: {
        type: Boolean,
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

module.exports = mongoose.model("legalAssessment", LegalAssessmentSchema);
