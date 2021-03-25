const mongoose = require("mongoose");
const user = require("../user/user");
const document = require("../document/document");
const section = require("../section/section");
const Schema = mongoose.Schema;

const TaskSchema = mongoose.Schema({
    task_id: {
        type: Number,
        required: true
    },
    assigneeId: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    assignedById: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    description: {
        type: String,
    },
    documentId: {
        type: Schema.Types.ObjectId,
        ref: document,
        required: true
    },
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: section
    },
    taskStatus: {
        type: String,
        enum: ['Open', 'InProgress', 'Review', 'Done'],
        default: 'Open'
    },
    taskType: {
        type: String,
        enum: ['Review', 'Annotate'],
        default: 'Review'
    }
});

module.exports = mongoose.model("task", TaskSchema);
