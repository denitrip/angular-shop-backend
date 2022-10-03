import {describe, expect, test} from '@jest/globals';
import { main }  from './handler';
import * as AWSMock from 'aws-sdk-mock';

jest.mock('../../libs/lambda', () => {
  return {
    __esModule: true,
    middyfy: jest.fn((result) => result)
  };
})

AWSMock.mock('S3', 'getSignedUrl', 'url');

describe('importProductsFile', () => {
    test('should console log file name', async () => {
        jest.spyOn(console, 'log');

        await main({queryStringParameters: {name: 'test name'}} as any, {} as any, {} as any)

        expect(console.log).toHaveBeenCalledWith("LOG: file name: ", "test name");
    });

    test('should return signed url', async () => {
        const result = await main({queryStringParameters: {name: 'test name'}} as any, {} as any, {} as any)

        expect(JSON.parse(result.body)).toHaveProperty('url');
    });

    test('should be able to process error', async () => {
        await expect(main({} as any, {} as any, {} as any)).rejects.toThrow();
    });
  });