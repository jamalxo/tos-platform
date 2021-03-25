const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const user = require("./models/user/userController");
const document = require("./models/document/documentController");
const section = require("./models/section/sectionController");
const task = require("./models/task/taskController");
const topicLabel = require("./models/topicLabel/topicLabelController");
const legalAssessment = require("./models/legalAssessment/legalAssessmentController");
const comment = require("./models/comment/commentController");

var cors = require('cors')

// get env vars
const dotenv = require('dotenv');
dotenv.config();

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// Allow CORS
app.use(cors())
const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
}

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

/**
 * Router Middleware
 */
app.use("/user", user);
app.use("/document", document);
app.use("/section", section);
app.use("/topicLabel", topicLabel);
app.use("/legalAssessment", legalAssessment);
app.use("/task", task);
app.use("/comment", comment);


app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});
