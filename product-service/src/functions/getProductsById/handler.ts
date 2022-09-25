import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import DatabaseService from "../../../db/services/database.service";

import schema from './schema';



const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const dbService = new DatabaseService();
  
  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
  console.log('LOG: event: ', event.pathParameters);

  const productId = Number(event?.pathParameters.id);
  console.log('LOG: productID = ',productId);

  if (!productId) {
    throw new Error("ProductID is missing");
  }

  console.log(`Querying ${PRODUCTS_TABLE} table`);
  const productQueryResult = await dbService.query({TableName: PRODUCTS_TABLE, KeyConditionExpression: 'id = :id', ExpressionAttributeValues: {':id':  productId}});
  console.log('LOG: product query output: ', productQueryResult?.Items[0]);

  console.log(`Querying ${STOCKS_TABLE} table`);
  const stocksQueryResult = await dbService.query({TableName: STOCKS_TABLE, KeyConditionExpression: 'product_id = :product_id', ExpressionAttributeValues: {':product_id':  productId}});
  console.log('LOG: stocks query output: ', stocksQueryResult?.Items[0]);

  console.log('Joining results...');
  const product = {
    ...productQueryResult?.Items[0],
    count: stocksQueryResult?.Items[0].count
  }
  console.log('LOG: result object: ', product);

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
