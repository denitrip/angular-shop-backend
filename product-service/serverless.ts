import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service-test',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { getProductsList, getProductsById  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
    },
  },
  resources: {
    Resources: {
        products: {
            Type: 'AWS::DynamoDB::Table',
            DeletionPolicy: 'Retain',
            Properties: {
                TableName: 'products',
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'N' },
                    { AttributeName: 'title', AttributeType: 'S' }
                ],
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                    { AttributeName: 'title', KeyType: 'RANGE' }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: '5',
                    WriteCapacityUnits: '5'
                }
            }
        },
        stocks: {
            Type: 'AWS::DynamoDB::Table',
            DeletionPolicy: 'Retain',
            Properties: {
                TableName: 'stocks',
                AttributeDefinitions: [
                    { AttributeName: 'product_id', AttributeType: 'N' },
                ],
                KeySchema: [
                    { AttributeName: 'product_id', KeyType: 'HASH' },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: '5',
                    WriteCapacityUnits: '5'
                }
            }
        }
    }
}
};

module.exports = serverlessConfiguration;
