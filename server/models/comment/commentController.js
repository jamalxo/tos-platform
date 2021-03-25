const express = require("express");
const router = express.Router();
const Comment = require("../comment/comment");
const Upvote = require("../upvote/upvote");
const auth = require("../../middleware/auth");

router.post(
    "/:commentId/edit", auth,
    async (req, res) => {
        const {
            content
        } = req.body;
        try {
            Comment.findById(req.params.commentId)
                .exec(function(err, comment) {
                    comment.content = content
                    comment.save().then(function (comment) {
                        res.status(201).json(comment);
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
    "/:commentId/upvote", auth,
    async (req, res) => {
        try {
            Comment.findById(req.params.commentId)
                .populate({
                    path: 'upvotes',
                    mode: 'upvote'
                })
                .exec(function(err, comment) {
                    let upvote = new Upvote({
                        createdBy: req.user.id,
                    });
                    let valid = true;
                    comment.upvotes.forEach(upvote => {
                        if (upvote.createdBy._id.toString() === req.user.id.toString()){
                            valid = false;
                        }
                    })
                    if (valid) {
                        upvote.save().then(function (upvote) {
                            comment.upvotes.push(upvote);
                            comment.save().then(function (comment) {
                                comment.populate('upvotes', function(err) {
                                    res.status(201).json(comment);
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
    "/:commentId/upvote/:upvoteId/delete", auth,
    async (req, res) => {
        try {
            Comment.findByIdAndUpdate(req.params.commentId, {$pull: {upvotes: req.params.upvoteId}}, function (err, _) {
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

module.exports = router;
