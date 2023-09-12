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
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Router = void 0;
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const app_1 = require("../../app");
const router = (0, express_1.Router)();
exports.s3Router = router;
router.get('/generate-presigned-url', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.query.filename;
    const operation = req.query.operation;
    const params = {
        Bucket: 'intern-sync-bucket',
        Key: fileName,
    };
    let command;
    if (operation === 'putObject') {
        command = new client_s3_1.PutObjectCommand(Object.assign(Object.assign({}, params), { ContentType: req.query.filetype }));
    }
    else {
        command = new client_s3_1.GetObjectCommand(params);
    }
    try {
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(app_1.s3Client, command, { expiresIn: 360 }); // 1 hour expiration
        res.json({ url });
    }
    catch (err) {
        console.error("Error generating presigned URL:", err);
        res.status(500).send(err);
    }
}));
router.delete('/delete-object', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.query.filename;
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: 'intern-sync-bucket',
        Key: fileName
    });
    try {
        yield app_1.s3Client.send(command);
        res.json({ message: "Object deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting object from S3:", err);
        res.status(500).send(err);
    }
}));
