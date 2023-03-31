// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set up AWS credentials and region
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

type Data = {
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = req.body.prompt;
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: '1024x1024',
  });

  const url: string = response.data.data[0].url as string;
  const imageResponse = await fetch(url);
  const imageData = await imageResponse?.buffer();
  const val = Math.floor(1000000 + Math.random() * 9000000);

  // Upload the image to S3 bucket
  const s3Params = {
    Bucket: 'pollock-art',
    Key: 'pollock-art' + val + '.jpg',
    Body: imageData,
    ContentType: 'image/jpeg',
  };

  s3.upload(s3Params, (err: any, data: any) => {
    if (err) {
      console.log('Error uploading image to S3 bucket:', err);
    } else {
      console.log('Image uploaded successfully to S3 bucket:', data);
      res.status(200).json({ url: data.Location });
    }
  });
}
