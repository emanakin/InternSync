import { s3Client } from '../app';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

async function fetchResumeFromS3(reference: string): Promise<Buffer> {
    const params = {
        Bucket: "intern-sync-bucket",
        Key: reference
    };

    const command = new GetObjectCommand(params);

    try {
        const data = await s3Client.send(command);
        return await streamToBuffer(data.Body as Readable);
    } catch (error) {
        console.error("Error fetching from S3:", error);
        throw new Error("No data returned from S3"); 
    }
}

export async function parseResume(reference: string): Promise<string> {
    const resumeBuffer = await fetchResumeFromS3(reference);

    const extension = reference.split('.').pop();

    switch (extension) {
        case 'pdf':
            const data = await pdf(resumeBuffer);
            return data.text;

        case 'docx':
            console.log('Extracting text from ', reference.substring(0, 100));
            const { value: text } = await mammoth.extractRawText({ buffer: resumeBuffer });
            
            return text;

        default:
            throw new Error('Unsupported file type.');
    }
}

export default parseResume;
