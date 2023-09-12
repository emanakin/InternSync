import axios from 'axios';
import * as fs from 'fs';
import { Category, Entity, ResumeData, Topic } from '../dto/resume';

const TEXTRAZOR_API_ENDPOINT = 'https://api.textrazor.com/';
const API_KEY = '02d0be5335043ad1337f419677b30a5ccfde50ccf012dc6e6ad1189a';  

async function tokenize(text: string, resumeId: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('extractors', 'entities,topics,categories');
    params.append('text', text);

    const response = await axios.post(TEXTRAZOR_API_ENDPOINT, params, {
        headers: {
            'X-TextRazor-Key': API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    console.log('Saving response to file...');
    console.log("loaded data: ", JSON.stringify(response.data["response"]).substring(0, 100));
    const tokens = extractResumeData(response.data["response"], resumeId);

    return tokens;
}

function extractResumeData(response: any, resumeId: string): ResumeData {
    const category: Category = {
        label: response["coarseTopics"][0]["label"],
        score: response["coarseTopics"][0]["score"]
    };

    const topics: Topic[] = response.topics.map((topic: any) => ({
        label: topic.label,
        score: topic.score
    }));

    const entities: Entity[] = response.entities.map((entity: any) => ({
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

export default tokenize;
