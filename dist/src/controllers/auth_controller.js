"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const users_model_1 = __importDefault(require("../models/users_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// register function to create a new user with email and password 
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email; // get email from request
    const password = req.body.password; // get password from request
    if (!email || !password) { // if email or password is not provided, send error response
        res.status(400).send("Missing email or password");
        return;
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10); // generate salt with 10 rounds 
        const hashedPassword = yield bcrypt_1.default.hash(password, salt); // hash the password with the salt 
        const user = yield users_model_1.default.create({
            email: email,
            password: hashedPassword,
        });
        res.status(200).send(user); // send the user object as response
    }
    catch (err) {
        res.status(400).send(err); // send the error object as response
    }
});
const generateTokens = (_id) => {
    //Create and assign a token
    const random = Math.floor(Math.random() * 1000000); // generate a random token number
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    const accessToken = jsonwebtoken_1.default.sign({
        _id: _id,
        random: random,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES }); // create a token with the user id and secret key 
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: _id,
        random: random,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }); // create a refresh token with the user id and secret key
    return { accessToken, refreshToken };
};
// login function to authenticate the user with email and password
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email; // get email from request
    const password = req.body.password; // get password from request
    if (!email || !password) { // if email or password is not provided, send error response
        res.status(400).send("Wrong username or password");
        return;
    }
    try {
        //Verify user
        const user = yield users_model_1.default.findOne({ email: email }); // find the user with the email  
        if (!user) { // if user not found, send error response
            res.status(400).send('Wrong username or password');
            return;
        }
        //Verify password
        if (typeof user.password !== 'string') {
            res.status(400).send('Invalid password format');
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password); // compare the password with the hashed password   
        if (!validPassword) { // if password is invalid, send error response
            res.status(400).send('Wrong username or password');
            return;
        }
        const userId = user._id.toString();
        const tokens = generateTokens(userId); // generate access and refresh tokens 
        if (!tokens) {
            res.status(400).send("Missing auth configuration");
            return;
        }
        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save(); // save the user object          
        res.status(200).send({
            email: user.email,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }); // send the token as response
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken; // get the refresh token from the request
    if (!refreshToken) { // if refresh token is not provided, send error response
        res.status(400).send("Missing Refresh Token");
        return;
    }
    //first validate the refresh token
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(403).send('Invalid Refresh Token');
            return;
        }
        const payload = data;
        try {
            const user = yield users_model_1.default.findById({ _id: payload._id });
            if (!user) {
                res.status(400).send('Invalid Token');
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                res.status(400).send('Invalid Token');
                user.refreshTokens = [];
                yield user.save();
                return;
            }
            const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens = tokens;
            yield user.save();
            res.status(200).send('Logged Out');
        }
        catch (err) {
            res.status(400).send("Invalid Token");
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //first validate the refresh token
    const refreshToken = req.body.refreshToken; // get the refresh token from the request
    if (!refreshToken) { // if refresh token is not provided, send error response
        res.status(400).send("Invalid Token");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(403).send('Invalid Refresh Token');
            return;
        }
        //find the user
        const payload = data;
        try {
            const user = yield users_model_1.default.findById({ _id: payload._id });
            if (!user) {
                res.status(400).send('Invalid Token');
                return;
            }
            //check that the token exists in the user
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                yield user.save();
                res.status(400).send('Invalid Token');
                return;
            }
            //generate a new access token
            const newTokens = generateTokens(user._id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                yield user.save();
                res.status(400).send("Missing auth configuration");
                return;
            }
            //delete the old refresh token
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            //save the new refresh token in the user
            user.refreshTokens.push(newTokens.refreshToken);
            yield user.save();
            //return the new access token and refresh token
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        }
        catch (err) {
            res.status(400).send("Invalid Token");
        }
    }));
});
//Middleware to authenticate the user with token
const authMiddleware = (req, res, next) => {
    const authorization = req.header('authorization'); // get the token from the header
    const token = authorization && authorization.split(' ')[1]; // get the token from the header 
    // if token is not found, send error response
    if (!token) {
        res.status(401).send('Missing Token');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send("Missing auth configuration");
        return;
    }
    // verify the token with the secret key
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            res.status(403).send('Invalid Token');
            return;
        }
        req.userId = data._id; // set the user id in the request object
        return next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = { register, login, logout, refresh };
//# sourceMappingURL=auth_controller.js.map