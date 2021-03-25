const express = require("express");
const router = express.Router();
const Task = require("./task");
const auth = require("../../middleware/auth");
const task = require("mongoose/lib/collection");

router.put(
    "/:taskId", auth,
    async (req, res) => {
        const {
            _id,
            task_id,
            assigneeId,
            assignedById,
            description,
            documentId,
            sectionId,
            taskStatus,
            taskType
        } = req.body;
        try {
            // We will update only the status, description and assignee
            const task = await Task.findById(req.params.taskId);
            task.description = description;
            task.assigneeId = assigneeId;
            task.taskStatus = taskStatus;
            task.save()
               .then(function (task) {
                    res.status(201).json(task);
                })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    });

router.post(
    "/", auth,
    async (req, res) => {
        console.log('Post -> {/task/}')
        const {
            assigneeId,
            assignedById,
            description,
            documentId,
            sectionId,
            taskType,
        } = req.body;
        try {

            // sort by `task_id` and descending
            const latestTask = await Task
                .find()
                .sort('-task_id')
                .limit(1)
                .exec();

            const task = (latestTask.length !== 0) ? new Task({
                task_id: `${latestTask[0].task_id + 1}`,
                assigneeId,
                assignedById,
                description,
                documentId,
                sectionId,
                taskType,
            }) : new Task({
                task_id: '0',
                assigneeId,
                assignedById,
                description,
                documentId,
                sectionId,
                taskType,
            });

            task.save().then(function (task) {
                res.status(201).json(task);
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    });

router.get("/", auth, async (req, res) => {
    try {
        console.log('Get -> {/task/}')
        const allTask = await Task.find({})
            .populate('documentId', 'title _id')
            .populate('assigneeId', 'firstName _id');
        res.json(allTask);
    } catch (e) {
        res.send({message: "Error in fetching task(s)"});
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('documentId', 'title _id')
            .populate('assigneeId', 'firstName _id');
        res.json(task);
    } catch (e) {
        console.error(e);
        res.send({message: "Error in Fetching document"});
    }
});

router.delete("/:id", auth, async (req, res) => {
    console.log(`Delete -> {/task/${req.params.id}}`);
    try {
        const task = await Task.deleteOne({_id: req.params.id});
        res.json(task);
    } catch (e) {
        console.error(e);
        res.send({message: "Error in Fetching document"});
    }
});

router.get("/assignee/:assigneeId", auth, async (req, res) => {
    try {
        const task = await Task.find({assigneeId: req.params.assigneeId})
            .populate('documentId', 'title _id')
            .populate('assigneeId', 'firstName _id');
        res.json(task);
    } catch (e) {
        console.error(e);
        res.send({message: "Error in Fetching document"});
    }
});

router.get("/document/:documentId", auth, async (req, res) => {
    try {
        console.log(`Get -> {task/document/${req.params.documentId}}`)
        const allTask = await Task.find({documentId: req.params.documentId})
        res.json(allTask);
    } catch (e) {
        console.error(e);
        res.send({message: "Error in Fetching document"});
    }
});

module.exports = router;
