import type { AWS } from '@serverless/typescript';

import { importProductsFile } from './src/functions/';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      BUCKET_NAME: 'import-service-dev-serverlessdeploymentbucket-cjzgizseur0m'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          "s3:*"
        ],
        Resource: [
          "arn:aws:s3:::${self:provider.environment.BUCKET_NAME}",
          "arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*"
        ]
      }
    ]
  },
  functions: { importProductsFile },
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
  },
};

module.exports = serverlessConfiguration;
