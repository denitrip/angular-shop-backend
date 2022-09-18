import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from 'src/constants';
import { Product } from '../../types'

import schema from './schema';


const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event?.pathParameters.id;

  if (!productId) {
    throw new Error("ProductID is missing");
  }

  return formatJSONResponse({
    product: productList.find((product: Product) => product.id === productId) || null
  });
};

export const main = middyfy(getProductsById);
