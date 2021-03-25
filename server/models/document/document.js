const user = require("../user/user");
const section = require("../section/section");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    sections: [{
        type: Schema.Types.ObjectId,
        ref: section
    }],
    status: {
        type: String,
        enum: ['Open', 'InProgress', 'Done'],
        default: 'Open'
    },
});

module.exports = mongoose.model("document", DocumentSchema);
