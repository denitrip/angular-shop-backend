import {describe, expect, test} from '@jest/globals';
import { productList } from '../../constants';
import { main }  from './handler';

jest.mock('../../libs/lambda', () => {
  return {
    __esModule: true,
    middyfy: jest.fn((result) => result)
  };
})

describe('getProductsList', () => {
  test('getProductsList should return full list of products', async () => {
    const result = await main({} as any, {} as any, {} as any)
    //@ts-ignore
    expect(JSON.parse(result?.body)).toStrictEqual(productList);
  });
});