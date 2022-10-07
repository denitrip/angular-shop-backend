import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import ResponseModel from '../../../db/models/response.model';

import DatabaseService from "../../../db/services/database.service";

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log('LOG: event object: ', event);
    console.log('LOG: payload = ', event.pathParameters);
    const dbService = new DatabaseService();
  
    const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
  
    const productId = Number(event?.pathParameters.id);
  
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
      return new ResponseModel({}, 400, "Product not found").generate();
    }
  
    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*'
      },
      body: JSON.stringify(product)
    }
  } catch(e) {
    return new ResponseModel({}, 500, `Internal server error`).generate();
  }

};

export const main = middyfy(getProductsById);
