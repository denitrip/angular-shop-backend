import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import * as payloadCheck  from 'payload-validator';
import DatabaseService from "../../../db/services/database.service";
import ResponseModel from '../../../db/models/response.model';
import { createPayload } from './utils';

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

  const dbService = new DatabaseService();

  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

  const transactPayload = createPayload(payload, PRODUCTS_TABLE, STOCKS_TABLE);

    console.log('LOG: starting the transact. Payload: ', transactPayload);
    try {
      await dbService.transactiWrite(transactPayload);

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
    } catch(e) {
      console.log('Transact error, items were not added into the table');
      return new ResponseModel({}, 500, `Internal server error, items were not added into the table`).generate();
    }
  } 
  catch(e) {
    return new ResponseModel({}, 500, `Internal server error`).generate();
  }
};

export const main = middyfy(createProduct);
