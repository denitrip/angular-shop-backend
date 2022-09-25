import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { productList } from '../../constants';
import { Product } from '../../types'

import schema from './schema';


const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event?.pathParameters.id;

  if (!productId) {
    throw new Error("ProductID is missing");
  }

  const product = productList.find((product: Product) => product.id === productId)

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(product)
  }
};

export const main = middyfy(getProductsById);
