const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const multer  = require('multer')
const upload = multer()

const Document = require("./document");
const Section = require("../section/section");
const Task = require("../task/task");
const TopicLabel = require("../topicLabel/topicLabel");
const LegalAssessment = require("../legalAssessment/legalAssessment");
const mongoose = require("mongoose");
const pdfreader = require("pdfreader");
const PDFParser = require("pdf2json");

router.post(
    "/upload", auth,
    async (req, res) => {
        const {
            title,
            content
        } = req.body;
        try {
            document = new Document({
                title,
                content,
                uploadedBy: req.user.id,
            });
            document.save().then(function (createdDocument) {
                res.status(201).json(createdDocument);
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post('/fromfile', auth, upload.single('file'), async (req, res) => {
    console.log('POST -> {/document/fromfile}')

    let title = req.file.originalname.slice(0,-4);
    let content = '';
    let pages = {};
    new pdfreader.PdfReader().parseBuffer(req.file.buffer, function (err, item) {
        if (err) console.log(err);
        else if (!item) {
            // base case - we reached the end of the document
            for (const [key, page] of Object.entries(pages)) {
                for (const [key, row] of Object.entries(page)) {
                    content += row + '\n';
                }
            }

            content = new Document({
                title,
                content,
                uploadedBy: req.user.id,
            });
            content.save().then(function (createdDocument) {
                res.status(201).json(createdDocument);
            })
        }
        else if (item.page) {
            // set hash map for new page:
            // we need to distinguish here since the vertical component of a two-dimensional
            // point is not unique for multiple pages
            pages[item.page] = {};
        }
        else if (item.text) {
            // rows.keys() > 0 because the first item is always a page
            const pageNumbers = Array.from(Object.keys(pages));
            const currentPage = pageNumbers.sort()[pageNumbers.length - 1];
            const rows = pages[currentPage];

            if (rows[item.y] !== undefined) {
                rows[item.y] = `${rows[item.y]}${item.text}`;
            } else {
                rows[item.y] = item.text;
            }
        }
    });
});

router.get("/", auth, async (req, res) => {
    console.log('GET -> {/document/}')
    try {
        const documents = await Document.find({})
            .populate('uploadedBy', 'firstName _id');
        res.json(documents);
    } catch (e) {
        res.send({message: "Error in Fetching document"});
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const document = await Document.findOne({ _id: req.params.id})
            .populate({
                path: 'sections',
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    model: 'legalAssessment'
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    model: 'topicLabel'
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    populate: {
                        path: 'createdBy',
                        model: 'user'
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    populate: {
                        path: 'comments',
                        model: 'comment',
                        populate: {
                            path: 'createdBy',
                            model: 'user'
                        }
                    }
                },
                options: {
                    sort: {'createdAt': 1}
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    populate: {
                        path: 'createdBy',
                        model: 'user'
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    populate: {
                        path: 'comments',
                        model: 'comment',
                        populate: {
                            path: 'createdBy',
                            model: 'user'
                        }
                    }
                },
                options: {
                    sort: {'createdAt': 1}
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    populate: {
                        path: 'comments',
                        model: 'comment',
                        populate: {
                            path: 'createdBy',
                            model: 'user'
                        }
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    populate: {
                        path: 'upvotes',
                        model: 'upvote',
                        populate: {
                            path: 'createdBy',
                            model: 'user'
                        }
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    populate: {
                        path: 'upvotes',
                        model: 'upvote',
                        populate: {
                            path: 'createdBy',
                            model: 'user'
                        }
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    populate: {
                        path: 'comments',
                        model: 'comment',
                        populate: {
                            path: 'upvotes',
                            model: 'upvote',
                            populate: {
                                path: 'createdBy',
                                model: 'user'
                            }
                        }
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    populate: {
                        path: 'comments',
                        model: 'comment',
                        populate: {
                            path: 'upvotes',
                            model: 'upvote',
                            populate: {
                                path: 'createdBy',
                                model: 'user'
                            }
                        }
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'createdBy',
                    model: 'user'
                },
                options: {
                    sort: {'from': 1}
                },
            })
            .populate('uploadedBy', 'firstName _id')
            .lean()
            .exec(function (err, document) {
                res.status(201).json(document);
        });
    } catch (e) {
        res.send({message: "Error in Fetching document"});
    }
});

router.delete("/:id", auth, async (req, res) => {
    console.log(`DELETE -> {/document/${req.params.id}}`);
    try {
        const deleteDocument = await Document.deleteOne({ _id: req.params.id});
        const deleteAllTask = await Task.deleteMany({ documentId: req.params.id});
        res.status(200).json({ message: "success" });
    } catch (e) {
        res.send({message: "Error in Deleting document"});
    }
});

router.post(
    "/:documentId/change-status", auth,
    async (req, res) => {
        const {
            status
        } = req.body;
        try {
            Document.findByIdAndUpdate(
                { _id: req.params.documentId },
                { status: status },
                function(err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Changing Status");
        }
    }
);

/**
 * This endpoint will return a set of annotation metadata for a given document identified by its id.
 */
router.get("/:documentId/annotation/", auth, async (req, res) => {
    console.log(`Get -> {/document/${req.params.documentId}/annotation}`);
    try {
        const document = await Document.findById(req.params.documentId)
            .populate({
                path: 'sections',
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    model: 'legalAssessment'
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'legalAssessments',
                    populate: {
                        path: 'createdBy',
                        model: 'user'
                    }
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    model: 'topicLabel'
                },
            })
            .populate({
                path: 'sections',
                populate: {
                    path: 'topicLabels',
                    populate: {
                        path: 'createdBy',
                        model: 'user'
                    }
                },
            })
            .lean()
            .exec();

        // takes a section and will extract metadata for all topicLabels and the legalAssessment
        const reducer = (acc, section) => {
            if (section !== null) {
                let allAnnotations = [];
                if (section.topicLabels !== undefined) {
                    allAnnotations = [... section.topicLabels.map((topicLabel) => {
                        return {
                            createdBy: topicLabel.createdBy._id,
                            label: topicLabel.label
                        }}), ...allAnnotations];
                }
                if (section.legalAssessments !== undefined) {
                    allAnnotations = [...(section.legalAssessments.map((legalAssessment) => {
                        return {
                            createdBy: legalAssessment.createdBy._id,
                            legal: legalAssessment.legal
                        }})), ...allAnnotations];
                }
                return [...acc, ...allAnnotations];
            } else {
                return acc;
            }
        }

        const allAnnotation = document.sections.reduce(reducer, []);

        res.json(allAnnotation);
    } catch (e) {
        res.send({message: "Error in Fetching document"});
    }
})

router.post(
    "/:documentId/section/create", auth,
    async (req, res) => {
        const {
            from,
            to,
            label,
            legal
        } = req.body;
        try {
            Document.findById(req.params.documentId)
                .exec(function(err, document) {
                    section = createSection(from, to, document.content.slice(from, to), req.user.id);
                    section.save().then(function (section) {
                        if (label) {
                            let topicLabel = new TopicLabel ({
                                createdBy: req.user.id,
                                label: label
                            })
                            topicLabel.save().then(function (topicLabel) {
                                section.topicLabels.push(topicLabel);
                                section.save();
                            })
                        } else {
                            let legalAssessment = new LegalAssessment ({
                                createdBy: req.user.id,
                                legal: legal
                            })
                            legalAssessment.save().then(function (legalAssessment) {
                                section.legalAssessments.push(legalAssessment);
                                section.save();
                            })
                        }
                        document.sections.push(section);
                        document.save().then(function (createdDocument) {
                            createdDocument.populate('sections sections.legalAssessments', function(err) {
                                res.status(201).json(createdDocument);
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

// delete Section
// Todo: delte all consecutive docs labels and comments
router.delete(
    "/:documentId/section/:sectionId/delete", auth,
    async (req, res) => {
        try {
            Document.findByIdAndUpdate(req.params.documentId, {$pull: {sections: req.params.sectionId}}, function (err, _) {
                Section.findById(req.params.sectionId).remove().exec(function(err, document) {
                    res.status(200).json({ message: "success" });
                });
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Deleting");
        }
    }
);

function createSection(from, to, content, userId) {
    return new Section({
        from: from,
        to: to,
        content: content,
        createdBy: userId ? userId : null
    });
}

module.exports = router;
