import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
const csv = require('csv-parser');
const S3 = new AWS.S3({region: 'eu-west-1', signatureVersion: 'v4' });
const SQS = new AWS.SQS();
const BUCKET_NAME = 'import-service-dev-serverlessdeploymentbucket-y8r9nxmq8wva';
const SQS_QUEUE_URL = 'https://sqs.eu-west-1.amazonaws.com/977382083391/catalogItemsQueue';

//TODO: remove it with normal ID generation
const getRandomId = () => {
    const min = 500;
    const max = 100000;
    return Math.floor(Math.random() * (max - min) + min); 
}

const importFileParser: any =  async (event) => {
  const promises = event.Records.map((record) => {

    return new Promise(() => {
      const params = { Bucket: BUCKET_NAME, Key: record.s3.object.key }
      const file = S3.getObject(params).createReadStream();
      
      file
      .pipe(csv())
      .on('data', (data) => {
          const payLoad = JSON.stringify({
            id: getRandomId(),
            price: data.price,
            title: data.title,
            count: data.count,
            description: data.description
          })

          SQS.sendMessage({QueueUrl: SQS_QUEUE_URL, MessageBody: payLoad}, (err, data) => {
            if (err) console.log(err);
            else {
              console.log('LOG: data has been sent')
            }
          })
      })
      .on('end', async () => {
        console.log('LOG: copying the file: ', record.s3.object.key);
        await S3.copyObject({ 
          Bucket: BUCKET_NAME, 
          CopySource: BUCKET_NAME + '/' + record.s3.object.key,
          Key: record.s3.object.key.replace('uploaded', 'parsed') }).promise();
    
        console.log('LOG: removing the file: ', record.s3.object.key);
        await S3.deleteObject({
          Bucket: BUCKET_NAME, 
          Key: record.s3.object.key}).promise();
      });
    });
  });

  return Promise.all(promises);
}

export const main = middyfy(importFileParser);
