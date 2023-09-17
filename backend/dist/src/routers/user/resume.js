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
exports.resumeRouter = void 0;
const express_1 = require("express");
const user_1 = require("../../models/user");
const tokenize_1 = __importDefault(require("../../algo/tokenize"));
const parse_1 = __importDefault(require("../../algo/parse"));
const router = (0, express_1.Router)();
exports.resumeRouter = router;
router.post('/update-resume', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, resume } = req.body;
    if (!email || !resume) {
        const err = new Error('Email and resume fields are required.');
        err.status = 400;
        return next(err);
    }
    // Fetch the user based on email
    const user = yield user_1.User.findOne({ email });
    // If user doesn't exist, return an error
    if (!user) {
        const err = new Error('User not found.');
        err.status = 404;
        return next(err);
    }
    // Update the user's resume reference
    const parsedText = yield (0, parse_1.default)(resume);
    // console.log('text extracted', parsedText);
    user.resume = yield (0, tokenize_1.default)(parsedText, resume);
    yield user.save();
    res.status(200).send({ message: 'Resume reference updated successfully.' });
}));
