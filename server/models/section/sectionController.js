const express = require("express");
const router = express.Router();
const Section = require("./section");
const LegalAssessment = require("../legalAssessment/legalAssessment");
const TopicLabel = require("../topicLabel/topicLabel");
const auth = require("../../middleware/auth");

router.post(
    "/:sectionId/annotate-legal", auth,
    async (req, res) => {
        const {
            legal
        } = req.body;
        try {
            Section.findById(req.params.sectionId)
                .exec(function(err, section) {
                    legalAssessment = new LegalAssessment({
                        createdBy: req.user.id,
                        legal: legal
                    })
                    legalAssessment.save().then(function (legalAssessment) {
                        section.legalAssessments.push(legalAssessment);
                        section.save().then(function (createdSection) {
                            createdSection.populate('legalAssessments', function(err) {
                                res.status(201).json(createdSection);
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

router.post(
    "/:sectionId/annotate-topic", auth,
    async (req, res) => {
        const {
            topic
        } = req.body;
        try {
            Section.findById(req.params.sectionId)
                .exec(function(err, section) {
                    topicLabel = new TopicLabel({
                        createdBy: req.user.id,
                        label: topic
                    })
                    topicLabel.save().then(function (topicLabel) {
                        section.topicLabels.push(topicLabel);
                        section.save().then(function (createdSection) {
                            createdSection.populate('topicLabels', function(err) {
                                res.status(201).json(createdSection);
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
    "/:sectionId/topicLabel/:topicLabelId/delete", auth,
    async (req, res) => {
        try {
            Section.findByIdAndUpdate(req.params.sectionId, {$pull: {topicLabels: req.params.topicLabelId}}, function (err, _) {
                TopicLabel.findById(req.params.topicLabelId).remove().exec(function(err, document) {
                    res.status(200).json({ message: "success" });
                });
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Deleting");
        }
    }
);

router.delete(
    "/:sectionId/legalAssessment/:legalAssessmentId/delete", auth,
    async (req, res) => {
        try {
            Section.findByIdAndUpdate(req.params.sectionId, {$pull: {legalAssessment: req.params.legalAssessmentId}}, function (err, _) {
                LegalAssessment.findById(req.params.legalAssessmentId).remove().exec(function(err, document) {
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
