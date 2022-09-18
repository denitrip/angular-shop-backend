import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productList } from 'src/constants';


const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(productList)
  }
};

export const main = middyfy(getProductsList);
