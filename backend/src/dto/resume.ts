export type Category = {
    label: string;
    score: number;
};

export type Topic = {
    label: string;
    score: number;
};

export type Entity = {
    entityId: string;
    confidenceScore: number;
    relevanceScore: number;
};

export type ResumeData = {
    id: string;
    data: {
        Category: Category;
        Topics: Topic[];
        Entities: Entity[];
    };
    jobMatches?: { [jobId: string]: number };  // optional for now, can be populated later
};