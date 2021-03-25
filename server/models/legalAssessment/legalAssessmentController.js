const express = require("express");
const router = express.Router();
const LegalAssessment = require("../legalAssessment/legalAssessment");
const Comment = require("../comment/comment");
const Upvote = require("../upvote/upvote");
const auth = require("../../middleware/auth");

router.post(
    "/:legalAssessmentId/comment", auth,
    async (req, res) => {
        const {
            content
        } = req.body;
        try {
            LegalAssessment.findById(req.params.legalAssessmentId)
                .exec(function(err, legalAssessment) {
                    comment = new Comment({
                        createdBy: req.user.id,
                        content: content
                    })
                    comment.save().then(function (comment) {
                        legalAssessment.comments.push(comment);
                        legalAssessment.save().then(function (createdLegalAssessment) {
                            createdLegalAssessment.populate('comments', function(err) {
                                res.status(201).json(createdLegalAssessment);
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

router.delete(
    "/:legalAssessmentId/comment/:commentId/delete", auth,
    async (req, res) => {
        try {
            LegalAssessment.findByIdAndUpdate(req.params.legalAssessmentId, {$pull: {comments: req.params.commentId}}, function (err, _) {
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

//upvote
router.post(
    "/:legalAssessmentId/upvote", auth,
    async (req, res) => {
        try {
            LegalAssessment.findById(req.params.legalAssessmentId)
                .populate({
                    path: 'upvotes',
                    mode: 'upvote'
                })
                .exec(function(err, legalAssessment) {
                    let upvote = new Upvote({
                        createdBy: req.user.id,
                    });
                    let valid = true;
                    legalAssessment.upvotes.forEach(upvote => {
                        if (upvote.createdBy._id.toString() === req.user.id.toString()){
                            valid = false;
                        }
                    })
                    if (valid) {
                        upvote.save().then(function (upvote) {
                            legalAssessment.upvotes.push(upvote);
                            legalAssessment.save().then(function (createdLegalAssessment) {
                                createdLegalAssessment.populate('upvotes', function(err) {
                                    res.status(201).json(createdLegalAssessment);
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
    "/:legalAssessmentId/upvote/:upvoteId/delete", auth,
    async (req, res) => {
        try {
            LegalAssessment.findByIdAndUpdate(req.params.legalAssessmentId, {$pull: {upvotes: req.params.upvoteId}}, function (err, _) {
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
