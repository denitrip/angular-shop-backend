import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
const csv = require('csv-parser');
const S3 = new AWS.S3({region: 'eu-west-1', signatureVersion: 'v4' });
const BUCKET_NAME = 'import-service-dev-serverlessdeploymentbucket-y8r9nxmq8wva';

const removeParsedFile = async (records) => {
  for (const record of records) {
    console.log('LOG: copying the file')
    await S3.copyObject({ 
      Bucket: BUCKET_NAME, 
      CopySource: BUCKET_NAME + '/' + record.s3.object.key,
      Key: record.s3.object.key.replace('uploaded', 'parsed') }).promise();

    console.log('LOG: removing the file')
    await S3.deleteObject({
      Bucket: BUCKET_NAME, 
      Key: record.s3.object.key}).promise();
  }
}

const importFileParser: any =  async (event) => {
  const promises = event.Records.map((record) => {

    return new Promise(() => {
      const params = { Bucket: BUCKET_NAME, Key: record.s3.object.key }
      const file = S3.getObject(params).createReadStream();
      file
      .pipe(csv())
      .on('data', (data) => {
          console.log('LOG: data row: ',data);
      })
      .on('end', () => {
          console.log('end');
      });
    });
  });

  return Promise.all(promises).then(async () => await removeParsedFile(event.Records));
}

export const main = middyfy(importFileParser);
