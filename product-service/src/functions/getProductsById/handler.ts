import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { productList } from '../../constants';
import { Product } from '../../types'

import schema from './schema';


const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event?.pathParameters.productId;

  if (!productId) {
    throw new Error("ProductID is missing");
  }

  const product = productList.find((product: Product) => product.id === productId)

  if (!product) {
    throw new Error("Product not found");
  }

  return formatJSONResponse({
    product: product
  });
};

export const main = middyfy(getProductsById);
