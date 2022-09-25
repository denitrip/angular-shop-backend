import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import DatabaseService from "../../../db/services/database.service";

import schema from './schema'

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productsPayload = {
    description: event.body.description,
    price: event.body.price,
    title: event.body.title,
    id: Number(event.body.id)
  }
  console.log('LOG: productsPayload = ', productsPayload);
  const stocksPayload = {
    count: event.body.count,
    product_id: Number(event.body.id)
  }
  console.log('LOG: stocksPayload = ',stocksPayload);

   const dbService = new DatabaseService();
  
  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

  console.log(`Adding data to ${PRODUCTS_TABLE} table`);
  await dbService.put({TableName: PRODUCTS_TABLE, Item: productsPayload});

  console.log(`Adding data to ${STOCKS_TABLE} table`);
  await dbService.put({TableName: STOCKS_TABLE, Item: stocksPayload});

  // console.log('Joining results...');
  // const result: Product[] = products?.Items.map((product: ProductDB) => {
  //   return ({
  //     ...product,
  //     count: stocks?.Items.find((stock: StockDB) => stock.product_id === product.id).count
  //   })
  // })
  // console.log('LOG: result: ', result);

  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify([])
  }
};

export const main = middyfy(createProduct);
