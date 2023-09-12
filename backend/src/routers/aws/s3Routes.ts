import { NextFunction, Router, Request, Response } from "express";
import * as AWS from 'aws-sdk';

const router = Router()
const s3 = new AWS.S3();

router.get('/generate-presigned-url', async (req: Request, res: Response, next: NextFunction) => {
  const fileName: string = req.query.filename as string;
  const operation: string = req.query.operation as string;

  const params: {
    Bucket: string;
    Key: string;
    Expires: number;
    ContentType?: string;
  } = {
    Bucket: 'intern-sync-bucket',
    Key: fileName,
    Expires: 360
  };

  if (operation === 'putObject') {
    params.ContentType = req.query.filetype as string;
  }

  s3.getSignedUrl(operation, params, (err, url) => {
    if (err) {
      console.error("Error generating presigned URL:", err);
      return res.status(500).send(err.message); 
    }
    res.json({ url });
  });

});

router.delete('/delete-object', async (req: Request, res: Response, next: NextFunction) => {
  const fileName: string = req.query.filename as string;
  
  const params = {
      Bucket: 'intern-sync-bucket',
      Key: fileName
  };

  s3.deleteObject(params, (err, data) => {
      if (err) {
          console.error("Error deleting object from S3:", err);
          return res.status(500).send(err.message); 
      }
      res.json({ message: "Object deleted successfully" });
  });
});


export { router as s3Router }