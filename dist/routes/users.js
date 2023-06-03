"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const user_1 = __importDefault(require("../models/user"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport = require("passport");
const authenticate = require("../authenticate");
const authenticate_1 = require("../authenticate");
userRouter.use(body_parser_1.default.json());
/* GET users listing. */
userRouter.get('/', (req, res, next) => {
    user_1.default.find().exec()
        .then((users) => {
        res.setHeader("Context-type", "application/json");
        res.statusCode = 200;
        res.json(users);
    })
        .catch((err) => {
        next(err);
    });
});
// create a user
userRouter
    .route("/")
    .post(authenticate_1.verifyUser, function (req, res, next) {
    user_1.default.create(req.body)
        .then((user) => {
        res.setHeader("Content-type", "application/json");
        res.statusCode = 200;
        res.json(user);
    })
        .catch((err) => {
        next(err);
    });
});
userRouter.post("/signup", (req, res, next) => {
    user_1.default.register(new user_1.default({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        }
        else {
            if (req.body.firstname)
                user.firstname = req.body.firstname;
            if (req.body.lastname)
                user.lastname = req.body.lastname;
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ err: err });
                    return;
                }
                passport.authenticate("local")(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ success: true, status: "Registration Successful!" });
                });
            });
        }
    });
});
userRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    // console.log(req.user) - user object
    let obj = { _id: req.user._id, adminStatus: req.user.admin };
    var token = authenticate.getToken(obj);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
    });
});
exports.default = userRouter;
