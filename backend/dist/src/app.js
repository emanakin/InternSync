"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.s3Client = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const cookie_session_1 = __importDefault(require("cookie-session"));
const routers_1 = require("./routers");
const logout_1 = require("./routers/auth/logout");
const fetch_jobs_1 = require("./routers/jobs/fetch-jobs");
const s3Routes_1 = require("./routers/aws/s3Routes");
const resume_1 = require("./routers/user/resume");
const path_1 = __importDefault(require("path"));
dotenv.config();
const app = (0, express_1.default)();
app.set('trust proxy', true);
// set to true when deployed
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development'
}));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.s3Client = new client_s3_1.S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
app.use(s3Routes_1.s3Router);
app.use(routers_1.signupRouter);
app.use(routers_1.loginRouter);
app.use(logout_1.logoutRouter);
app.use(fetch_jobs_1.jobsRouter);
app.use(resume_1.resumeRouter);
app.use(express_1.default.static(path_1.default.join(__dirname, '/public')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '/public/index.html'));
});
app.use((error, req, res, next) => {
    if (error.status) {
        return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URL)
        throw new Error('MONGO_URL required!');
    if (!process.env.JWT_KEY)
        throw new Error('JWT_KEY required!');
    if (!process.env.AWS_ACCESS_KEY_ID)
        throw new Error('AWS_ACCESS_KEY required!');
    if (!process.env.AWS_SECRET_ACCESS_KEY)
        throw new Error('AWS_SECRET_ACCESS_KEY required!');
    console.log(process.env.MONGO_URL);
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URL);
    }
    catch (err) {
        console.error("Database connection failed:", err);
        throw new Error('Database connection error');
    }
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
start();
