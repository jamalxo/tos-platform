const mongoose = require("mongoose");
const user = require("../user/user");
const topicLabel = require("../topicLabel/topicLabel");
const legalAssessment = require("../legalAssessment/legalAssessment");
const Schema = mongoose.Schema;

const SectionSchema = mongoose.Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: user,
    },
    from: {
        type: Number,
        required: true
    },
    to: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    topicLabels: [{
        type: Schema.Types.ObjectId,
        ref: topicLabel
    }],
    legalAssessments: [{
        type: Schema.Types.ObjectId,
        ref: legalAssessment
    }]
});

module.exports = mongoose.model("section", SectionSchema);
