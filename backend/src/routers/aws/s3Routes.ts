import { NextFunction, Router, Request, Response } from "express";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../app";

const router = Router()

router.get('/generate-presigned-url', async (req: Request, res: Response, next: NextFunction) => {
  const fileName: string = req.query.filename as string;
  const operation: string = req.query.operation as string;

  const params = {
    Bucket: 'intern-sync-bucket',
    Key: fileName,
  };

  let command;
  if (operation === 'putObject') {
      command = new PutObjectCommand({
          ...params,
          ContentType: req.query.filetype as string
      });
  } else {
      command = new GetObjectCommand(params);
  }

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 360 });  // 1 hour expiration
    res.json({ url });
  } catch (err) {
      console.error("Error generating presigned URL:", err);
      res.status(500).send(err);
  }
});

router.delete('/delete-object', async (req: Request, res: Response, next: NextFunction) => {
  const fileName: string = req.query.filename as string;

    const command = new DeleteObjectCommand({
        Bucket: 'intern-sync-bucket',
        Key: fileName
    });

    try {
        await s3Client.send(command);
        res.json({ message: "Object deleted successfully" });
    } catch (err) {
        console.error("Error deleting object from S3:", err);
        res.status(500).send(err);
    }
});


export { router as s3Router }