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
exports.parseResume = void 0;
const app_1 = require("../app");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const client_s3_1 = require("@aws-sdk/client-s3");
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}
function fetchResumeFromS3(reference) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: "intern-sync-bucket",
            Key: reference
        };
        const command = new client_s3_1.GetObjectCommand(params);
        try {
            const data = yield app_1.s3Client.send(command);
            return yield streamToBuffer(data.Body);
        }
        catch (error) {
            console.error("Error fetching from S3:", error);
            throw new Error("No data returned from S3");
        }
    });
}
function parseResume(reference) {
    return __awaiter(this, void 0, void 0, function* () {
        const resumeBuffer = yield fetchResumeFromS3(reference);
        const extension = reference.split('.').pop();
        switch (extension) {
            case 'pdf':
                const data = yield (0, pdf_parse_1.default)(resumeBuffer);
                return data.text;
            case 'docx':
                console.log('Extracting text from ', reference.substring(0, 100));
                const { value: text } = yield mammoth_1.default.extractRawText({ buffer: resumeBuffer });
                return text;
            default:
                throw new Error('Unsupported file type.');
        }
    });
}
exports.parseResume = parseResume;
exports.default = parseResume;
