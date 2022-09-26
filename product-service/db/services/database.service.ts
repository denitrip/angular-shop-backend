import * as AWS from 'aws-sdk';

// Models
import ResponseModel from '../models/response.model';

// Put
type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;

// Batch write
type BatchWrite = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
type BatchWriteOutPut = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;

// Update
type UpdateItem = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutPut = AWS.DynamoDB.DocumentClient.UpdateItemOutput;

// Query
type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

// Get
type GetItem = AWS.DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;

// Delete
type DeleteItem = AWS.DynamoDB.DocumentClient.DeleteItemInput;
type DeleteItemOutput = AWS.DynamoDB.DocumentClient.DeleteItemOutput;

// Scan
type ScanItems = AWS.DynamoDB.DocumentClient.ScanInput;
type ScanItemsOutput = AWS.DynamoDB.DocumentClient.ScanOutput;

// transaction write
type TransactWriteItem= AWS.DynamoDB.DocumentClient.TransactWriteItemsInput;
type TransactWriteItemsOutput = AWS.DynamoDB.DocumentClient.TransactWriteItemsOutput;

AWS.config.update({ region: "eu-west-1" });

const documentClient = new AWS.DynamoDB.DocumentClient();

export default class DatabaseService {

    put = async(params: PutItem): Promise<PutItemOutput> => {
        try {
            return await documentClient.put(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `put-error: ${error?.errorMessage}`);
        }
    }

    batchCreate = async(params: BatchWrite): Promise<BatchWriteOutPut> => {
        try {
            return await documentClient.batchWrite(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `batch-write-error: ${error?.errorMessage}`);
        }
    }

    update = async (params: UpdateItem): Promise<UpdateItemOutPut> => {
        try {
            return await documentClient.update(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `update-error: ${error?.errorMessage}`);
        }
    }

    query = async (params: QueryItem): Promise<QueryItemOutput> => {
        try {
            return await documentClient.query(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `query-error: ${error?.errorMessage}`);
        }
    }

    get = async (params: GetItem): Promise<GetItemOutput> => {
        try {
            return await documentClient.get(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `get-error: ${error?.errorMessage}`);
        }
    }

    delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
        try {
            return await documentClient.delete(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `delete-error: ${error?.errorMessage}`);
        }
    }

    scan = async (params: ScanItems): Promise<ScanItemsOutput> => {
        try {
            return await documentClient.scan(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `scan-error: ${error?.errorMessage}`);
        }
    }

    transactiWrite = async (params: TransactWriteItem): Promise<TransactWriteItemsOutput> => {
        try {
            return await documentClient.transactWrite(params).promise();
        } catch (error) {
            throw new ResponseModel({}, 500, `transact-write-error: ${error?.errorMessage}`);
        }
    }
}