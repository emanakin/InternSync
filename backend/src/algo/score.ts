import { User } from "../models/user";
import { Job } from "../models/jobs";


const categoryMatchingScore = (resumeCategory: string, jobCategory: string): number => {
    return resumeCategory === jobCategory ? 1 : 0;
};

const topicMatchingScore = (resumeTopics: any[], jobTopics: any[]): number => {
    let score = 0;
    for (let jobTopic of jobTopics) {
        const matchedResumeTopic = resumeTopics.find(rt => rt.label === jobTopic.label);
        if (matchedResumeTopic) {
            score += matchedResumeTopic.score * jobTopic.score;
        }
    }
    return score / jobTopics.length;
};

const entityMatchingScore = (resumeEntities: any[], jobEntities: any[]): number => {
    let score = 0;
    for (let jobEntity of jobEntities) {
        const matchedResumeEntity = resumeEntities.find(re => re.entityId === jobEntity.entityId);
        if (matchedResumeEntity) {
            score += matchedResumeEntity.relevanceScore * jobEntity.confidenceScore;
        }
    }
    return score / jobEntities.length;
};

export async function computeScoresForAllJobs(userId: string): Promise<ScoreEntry[]> {
    const allJobs = await Job.find({});
    const user = await User.findById(userId);
    if (!user || !user.resume) throw new Error('User resume not found');

    const { Category, Topics, Entities } = user.resume.data;

    const Wc = 0.5;
    const Wt = 0.3;
    const We = 0.2;

    const scores: ScoreEntry[] = [];

    for (let job of allJobs) {
        const categoryScore = categoryMatchingScore(Category.label, job.tokens.Category);
        const topicScore = topicMatchingScore(Topics, job.tokens.Topics);
        const entityScore = entityMatchingScore(Entities, job.tokens.Entities);

        const overallScore = Wc * categoryScore + Wt * topicScore + We * entityScore;

        scores.push({
            jobId: job._id.toString(),
            resumeRef: user.resume.id, // assuming there's a 'reference' field in resume object
            score: overallScore
        });
    }

    return scores;
};

type ScoreEntry = {
    jobId: string;
    resumeRef: string;
    score: number;
};