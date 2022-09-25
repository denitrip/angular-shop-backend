import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import * as payloadCheck  from 'payload-validator';
import DatabaseService from "../../../db/services/database.service";
import ResponseModel from '../../../db/models/response.model';

import schema from './schema'

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log('LOG: payload = ', event.body);
    const payload = {price: event.body.price, title: event.body.title, description: event.body.description, count: event.body.count, id: Number(event.body.id)}

  try {
    const payloadCheckResult = payloadCheck.validator(payload, {title: '', description: '', count: '', price: '', id: 0})
    console.log('LOG: payload check sucess: ', payloadCheckResult.success);

    if (!payloadCheckResult.success || isNaN(payload.id)) {
      return new ResponseModel({}, 400, `payload validation error`).generate();
    }
  } catch(e) {
    return new ResponseModel({}, 400, `payload validation error`).generate();
  }

  const productsPayload = {
    description: payload.description,
    price: payload.price,
    title: payload.title,
    id: payload.id
  }
  console.log('LOG: productsPayload = ', productsPayload);
  const stocksPayload = {
    count: payload.count,
    product_id: payload.id
  }
  console.log('LOG: stocksPayload = ',stocksPayload);

  const dbService = new DatabaseService();

  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

    console.log(`Adding data to ${PRODUCTS_TABLE} table`);
    await dbService.put({TableName: PRODUCTS_TABLE, Item: productsPayload});
  
    console.log(`Adding data to ${STOCKS_TABLE} table`);
    await dbService.put({TableName: STOCKS_TABLE, Item: stocksPayload});
    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: "Item has been created"
      })
    }
  } 
  catch(e) {
    return new ResponseModel({}, 500, `Internal server error`).generate();
  }
};

export const main = middyfy(createProduct);
