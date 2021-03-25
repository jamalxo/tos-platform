const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token");
    if (!token) return res.status(401).json({ message: "Auth Error" });

    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next();
    } catch (e) {
        console.log(token)
        console.error(e);
        res.status(500).send({ message: "Invalid Token" });
    }
};
