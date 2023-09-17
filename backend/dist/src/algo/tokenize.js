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
const axios_1 = __importDefault(require("axios"));
const TEXTRAZOR_API_ENDPOINT = 'https://api.textrazor.com/';
const API_KEY = '02d0be5335043ad1337f419677b30a5ccfde50ccf012dc6e6ad1189a';
function tokenize(text, resumeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = new URLSearchParams();
        params.append('extractors', 'entities,topics,categories');
        params.append('text', text);
        const response = yield axios_1.default.post(TEXTRAZOR_API_ENDPOINT, params, {
            headers: {
                'X-TextRazor-Key': API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('Saving response to file...');
        console.log("loaded data: ", JSON.stringify(response.data["response"]).substring(0, 100));
        const tokens = extractResumeData(response.data["response"], resumeId);
        return tokens;
    });
}
function extractResumeData(response, resumeId) {
    const category = {
        label: response["coarseTopics"][0]["label"],
        score: response["coarseTopics"][0]["score"]
    };
    const topics = response.topics.map((topic) => ({
        label: topic.label,
        score: topic.score
    }));
    const entities = response.entities.map((entity) => ({
        entityId: entity.entityId,
        confidenceScore: entity.confidenceScore,
        relevanceScore: entity.relevanceScore
    }));
    return {
        id: resumeId,
        data: {
            Category: category,
            Topics: topics,
            Entities: entities
        }
    };
}
exports.default = tokenize;
