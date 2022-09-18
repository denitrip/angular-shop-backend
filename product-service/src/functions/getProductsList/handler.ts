import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from 'src/constants';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return formatJSONResponse({
    products: productList
  });
};

export const main = middyfy(getProductsList);
