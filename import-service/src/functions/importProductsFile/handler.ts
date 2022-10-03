import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
    const S3 = new AWS.S3({region: 'eu-west-1'})
    const BUCKET_NAME = 'import-service-dev-serverlessdeploymentbucket-cjzgizseur0m';
    const prefix = 'uploaded/';
    const fileName = event.queryStringParameters.fileName;
    console.log('LOG: file name: ', fileName);

    const S3params = {
      Bucket: BUCKET_NAME,
      Prefix: prefix
    }

    try {
      const s3response = await S3.listObjectsV2(S3params).promise()
      const objectsList = s3response.Contents;
      console.log('LOG: objects list: ', objectsList)
      const object = objectsList.filter(object => object.Size).find(object => object.Key.includes(fileName))

      if(!object) {
        return {
          statusCode: 400,
          body: 'no such onject found in S3'
        }
      }

      console.log('LOG: object in S3: ', object);
      return {
        statusCode: 200,
        headers: {
          'access-control-allow-origin': '*'
        },
        body: `https://${BUCKET_NAME}.s3.amazonaws.com/${object.Key}`
      }
    } catch(e) {
      return {
        statusCode: 500,
        body: JSON.stringify(e)
      }
    }

};

export const main = middyfy(importProductsFile);
