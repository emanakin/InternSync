import { S3 } from 'aws-sdk';  
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

async function fetchResumeFromS3(reference: string): Promise<Buffer> {
    const s3 = new S3();  // Initialize with appropriate configurations

    const params = {
        Bucket: "intern-sync-bucket",
        Key: reference
    };

    const data = await s3.getObject(params).promise();

    return data.Body as Buffer;
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
