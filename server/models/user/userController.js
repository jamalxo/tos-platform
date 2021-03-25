const express = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("./user");
const auth = require("../../middleware/auth");
const mail = require("../../utils/mail");

router.get("/", auth, async (req, res) => {
    console.log('GET -> {/user/}')
    try {
        const allUser = await User.find({});
        res.json(allUser);
    } catch (e) {
        console.error(e);
        res.send({message: "Error in fetching users"});
    }
});

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */
router.post(
    "/signup",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }
            user = new User({
                firstName,
                lastName,
                email,
                password
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const token = user.generateJWT();
            res.status(200).json({
                token
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

router.post(
    "/recover",
    [
        check("email", "Please enter a valid email").isEmail(),
    ],
    async (req, res) => {
        console.log("Post -> {/user/recover}")
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            email,
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });

            // generate password @reset token
            user.generatePasswordReset();

            await user.save();

            await mail.recovery(req, user);
            res.status(200).json({message: 'Your password reset request is being processed. A reset email has been sent to the address linked to your account'});
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

/**
 * @method - Get
 * @description - Validate token and redirect user to @reset password view
 * @param - Reset Password Token
 * */
router.get("/reset/:token", async (req, res) => {
    try {
        const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}});
        if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

        res.redirect(`http://localhost:4200/reset/${req.params.token}`);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

/**
 * @method - Post
 * @description - Validate token and accept new password
 * @param - Reset Password Token
 * @param - Password
 * */
router.post("/reset/:token", async (req, res) => {
    try {
        console.log("Post -> {/user/reset}")
        const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}});
        if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

        //Set the new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        await mail.reset(user);
        res.status(200).json({message: 'Password was updated'});
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});


/**
 * @method - Get
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get("/me", auth, async (req, res) => {
    console.log('GET -> {/user/me}');
    try {
        // request.user is getting fetched from Middleware after token authentication
        console.log(req.user.id);
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

router.post(
    "/edit",
    auth,
    async (req, res) => {

        const {
            firstName,
            lastName,
            email,
            location,
            company
        } = req.body;
        try {
            User.findById(req.user.id, function (err, user) {
                user.firstName=firstName;
                user.lastName=lastName;
                user.email=email;
                user.location=location;
                user.company=company;
                user.save().then(function(editedUser){
                    res.status(200).send(editedUser);
                })
            } );

        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in editing user");
        }
    }
);

module.exports = router;
