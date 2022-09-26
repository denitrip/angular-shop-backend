import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import type {ProductDB, StockDB, Product} from '../../types'
import ResponseModel from '../../../db/models/response.model';

import DatabaseService from "../../../db/services/database.service";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  try {
  console.log('LOG: event object: ', event);
  const dbService = new DatabaseService();
  
  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

  console.log(`Scanning ${PRODUCTS_TABLE} table`);
  const products = await dbService.scan({TableName: PRODUCTS_TABLE});
  console.log(`LOG: ${PRODUCTS_TABLE} table content: `, products?.Items);

  console.log(`Scanning ${STOCKS_TABLE} table`);
  const stocks = await dbService.scan({TableName: STOCKS_TABLE});
  console.log(`LOG: ${STOCKS_TABLE}  table content: `, stocks?.Items);

  console.log('Joining results...');
  const result: Product[] = products?.Items.map((product: ProductDB) => {
    return ({
      ...product,
      count: stocks?.Items.find((stock: StockDB) => stock.product_id === product.id).count
    })
  })
  console.log('LOG: result: ', result);

  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(result)
  }
} catch (e) {
  return new ResponseModel({}, 500, `Internal server error`).generate();
}
};

export const main = middyfy(getProductsList);
