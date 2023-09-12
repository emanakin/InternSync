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
exports.computeScoresForAllJobs = void 0;
const user_1 = require("../models/user");
const jobs_1 = require("../models/jobs");
const categoryMatchingScore = (resumeCategory, jobCategory) => {
    return resumeCategory === jobCategory ? 1 : 0;
};
const topicMatchingScore = (resumeTopics, jobTopics) => {
    let score = 0;
    for (let jobTopic of jobTopics) {
        const matchedResumeTopic = resumeTopics.find(rt => rt.label === jobTopic.label);
        if (matchedResumeTopic) {
            score += matchedResumeTopic.score * jobTopic.score;
        }
    }
    return score / jobTopics.length;
};
const entityMatchingScore = (resumeEntities, jobEntities) => {
    let score = 0;
    for (let jobEntity of jobEntities) {
        const matchedResumeEntity = resumeEntities.find(re => re.entityId === jobEntity.entityId);
        if (matchedResumeEntity) {
            score += matchedResumeEntity.relevanceScore * jobEntity.confidenceScore;
        }
    }
    return score / jobEntities.length;
};
function computeScoresForAllJobs(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const allJobs = yield jobs_1.Job.find({});
        const user = yield user_1.User.findById(userId);
        if (!user || !user.resume)
            throw new Error('User resume not found');
        const { Category, Topics, Entities } = user.resume.data;
        const Wc = 0.5;
        const Wt = 0.3;
        const We = 0.2;
        const scores = [];
        for (let job of allJobs) {
            const categoryScore = categoryMatchingScore(Category.label, job.tokens.Category);
            const topicScore = topicMatchingScore(Topics, job.tokens.Topics);
            const entityScore = entityMatchingScore(Entities, job.tokens.Entities);
            const overallScore = Wc * categoryScore + Wt * topicScore + We * entityScore;
            scores.push({
                jobId: job._id.toString(),
                resumeRef: user.resume.id,
                score: overallScore
            });
        }
        return scores;
    });
}
exports.computeScoresForAllJobs = computeScoresForAllJobs;
;
