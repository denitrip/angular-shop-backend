import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById, createProduct, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks',
      SQS_QUEUE_NAME: 'catalogItemsQueue',
      SNS_TOPIC_NAME: 'createProductTopic',
      SQS_URL: {
        Ref: 'SQSQueue'
      },
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
        ],
        Resource: [
          {"Fn::GetAtt": [ 'products', 'Arn' ]},
          {"Fn::GetAtt": [ 'stocks', 'Arn' ]}
        ]
      },
      {
        Effect: 'Allow',
        Action: [
            "sqs:*"
        ],
        Resource: [
          {"Fn::GetAtt": [ 'SQSQueue', 'Arn' ]}
        ]
      },
      {
        Effect: 'Allow',
        Action: [
            "sns:*"
        ],
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ]
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
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
        SQSQueue: {
            Type: 'AWS::SQS::Queue',
            Properties: {
              QueueName: '${self:provider.environment.SQS_QUEUE_NAME}'
            }
        },
        SNSTopic: {
            Type: 'AWS::SNS::Topic',
            Properties: {
              TopicName: '${self:provider.environment.SNS_TOPIC_NAME}'
            }
        },
        SNSSubscription: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
              Endpoint: 'dzianis.puchko@gmail.com',
              Protocol: 'email',
              TopicArn: {
                Ref: 'SNSTopic'
              },
              FilterPolicy: {
                messageEvent: ["cheap_product"],
              }
            }
        },
        VipSNSSubscription: {
          Type: 'AWS::SNS::Subscription',
          Properties: {
            Endpoint: 'dzianis.aws.test@gmail.com',
            Protocol: 'email',
            TopicArn: {
              Ref: 'SNSTopic'
            },
            FilterPolicy: {
              messageEvent: ["vip_product"],
            }
          }
      },  
        products: {
            Type: 'AWS::DynamoDB::Table',
            DeletionPolicy: 'Retain',
            Properties: {
                TableName: '${self:provider.environment.PRODUCTS_TABLE}',
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
                TableName: '${self:provider.environment.STOCKS_TABLE}',
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
