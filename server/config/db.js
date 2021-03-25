const mongoose = require("mongoose");
// Replace this with your MONGOURI.
const MONGOURI = "mongodb+srv://admin:tos123@tos-db.e9p2p.mongodb.net/test";
const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        });
        console.log("Connected to DB !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};
module.exports = InitiateMongoServer;
