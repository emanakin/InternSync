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
exports.loginRouter = void 0;
const express_1 = require("express");
const user_1 = require("../../models/user");
const common_1 = require("../../../common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
exports.loginRouter = router;
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.user.email;
    const password = req.body.user.password;
    const user = yield user_1.User.findOne({ email });
    if (!user) {
        const err = new Error('Wrong credentials');
        err.status = 401;
        return next(err);
    }
    const isEqual = yield common_1.authenticationService.pwdCompare(user.password, password);
    if (!isEqual) {
        const err = new Error('Wrong credentials');
        err.status = 409;
        return next(err);
    }
    const token = jsonwebtoken_1.default.sign({ resumeUrl: user.resume, imgUrl: user.profile_picture, email, first_name: user.first_name, last_name: user.last_name, userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.status(200).send({ user, token });
}));
