import {describe, expect, test} from '@jest/globals';
import { productList } from '../../constants';
import { main }  from './handler';

jest.mock('../../libs/lambda', () => {
  return {
    __esModule: true,
    middyfy: jest.fn((result) => result),
    formatJSONResponse: jest.fn((result) => result)
  };
})

describe('getProductsById', () => {
  test('getProductsById should return result if such product exist in array', async () => {
    const result = await main({pathParameters: {productId: '1'}} as any, {} as any, {} as any);
    const expectedResult = productList[0];

    expect(JSON.parse(result.body).product).toStrictEqual(expectedResult);
  });

  test('should throw error NO PRODUCT FOUND if product does not exist in array', async () => {
    await expect(main({pathParameters: {productId: 'wrongID'}} as any, {} as any, {} as any)).rejects.toThrow('Product not found');
  });

  test('should throw error MISSING PRODUCT ID when product is was not provided as a param', async () => {
    await expect(main({pathParameters: {}} as any, {} as any, {} as any)).rejects.toThrow('ProductID is missing');
  });
});