const express = require("express");
const router = express.Router();
const TopicLabel = require("../topicLabel/topicLabel");
const Comment = require("../comment/comment");
const Upvote = require("../upvote/upvote");
const auth = require("../../middleware/auth");

router.post(
    "/:topicLabelId/comment", auth,
    async (req, res) => {
        const {
            content
        } = req.body;
        try {
            TopicLabel.findById(req.params.topicLabelId)
                .exec(function(err, topicLabel) {
                    comment = new Comment({
                        createdBy: req.user.id,
                        content: content
                    })
                    comment.save().then(function (comment) {
                        topicLabel.comments.push(comment);
                        topicLabel.save().then(function (createdTopicLabel) {
                            createdTopicLabel.populate('comments', function(err) {
                                res.status(201).json(createdTopicLabel);
                            });
                        })
                    })
                })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

//upvote
router.post(
    "/:topicLabelId/upvote", auth,
    async (req, res) => {
        try {
            TopicLabel.findById(req.params.topicLabelId)
                .populate({
                    path: 'upvotes',
                    mode: 'upvote'
                })
                .exec(function(err, topicLabel) {
                    let upvote = new Upvote({
                        createdBy: req.user.id,
                    });
                    let valid = true;
                    topicLabel.upvotes.forEach(upvote => {
                        if (upvote.createdBy._id.toString() === req.user.id.toString()){
                            valid = false;
                        }
                    })
                    if (valid) {
                        upvote.save().then(function (upvote) {
                            topicLabel.upvotes.push(upvote);
                            topicLabel.save().then(function (createdTopicLabel) {
                                createdTopicLabel.populate('upvotes', function(err) {
                                    res.status(201).json(createdTopicLabel);
                                });
                            })
                        })
                    } else {
                        res.status(500).send("Is Already Upvoted by User");
                    }
                })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

//downvote
router.delete(
    "/:topicLabelId/upvote/:upvoteId/delete", auth,
    async (req, res) => {
        try {
            TopicLabel.findByIdAndUpdate(req.params.topicLabelId, {$pull: {upvotes: req.params.upvoteId}}, function (err, _) {
                Upvote.findById(req.params.upvoteId).remove().exec(function(err, document) {
                    res.status(200).json({ message: "success" });
                });
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.delete(
    "/:topicLabelId/comment/:commentId/delete", auth,
    async (req, res) => {
        try {
            TopicLabel.findByIdAndUpdate(req.params.topicLabelId, {$pull: {comments: req.params.commentId}}, function (err, _) {
                Comment.findById(req.params.commentId).remove().exec(function(err, document) {
                    res.status(200).json({ message: "success" });
                });
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Deleting");
        }
    }
);

module.exports = router;
