"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.getToken = void 0;
const passport = require("passport");
const crypto = require("crypto");
const passport_local_1 = require("passport-local");
const LocalStrategy = passport_local_1.Strategy;
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const JwtStrategy = passport_jwt_1.default.Strategy;
const passport_jwt_2 = __importDefault(require("passport-jwt"));
const ExtractJwt = passport_jwt_2.default.ExtractJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // used to create, sign, and verify tokens
const user_1 = __importDefault(require("./models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.secretKey;
passport.use(new LocalStrategy(user_1.default.authenticate()));
passport.serializeUser(user_1.default.serializeUser());
passport.deserializeUser(user_1.default.deserializeUser());
const getToken = (user) => {
    return jsonwebtoken_1.default.sign(user, secretKey, { expiresIn: 3600 });
};
exports.getToken = getToken;
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    user_1.default.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}));
exports.verifyUser = passport.authenticate("jwt", { session: false });
exports.default = {};
