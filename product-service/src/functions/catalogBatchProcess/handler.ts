
import { middyfy } from '../../libs/lambda';
import DatabaseService from "../../../db/services/database.service";
import { createPayload } from '../createProduct/utils';
import * as AWS from 'aws-sdk';

const catalogBatchProcess = async (event) => {
  const dbService = new DatabaseService();
  const SNS = new AWS.SNS({region: 'eu-west-1'})

  const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

  for await (const record of event?.Records) {
    const payLoad = JSON.parse(record.body);
    const isVipProduct = Number(payLoad.price) > 200;

    console.log('LOG: product payload: ',payLoad)

    const transactPayload = createPayload(payLoad, PRODUCTS_TABLE, STOCKS_TABLE);

    try {
      await dbService.transactiWrite(transactPayload);
      console.log('LOG: item has beed added to database: ',payLoad.title)

      await SNS.publish({
        Subject: 'New items in your database',
        Message: `A new product has been added to your database: ${JSON.stringify(transactPayload)}`,
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          messageEvent: {
            DataType: 'String',
            StringValue: isVipProduct ? 'vip_product' : 'cheap_product'
         }
        }
      }, (err, data) => {
        if(err) console.log(err);
        else {
          console.log('LOG: email notification has been sent')
        }
      }).promise()
    } catch(e) {
      console.log('Transact error, items were not added into the table: ',payLoad.title);
    }  
  }
};

export const main = middyfy(catalogBatchProcess);
