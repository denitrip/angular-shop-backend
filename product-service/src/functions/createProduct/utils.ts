export const createPayload = (payload, productTableName, stocksTableName) => {
    return ({
        TransactItems: [
          {
            Put: { 
              Item: {
                description: payload.description,
                price: payload.price,
                title: payload.title,
                id: payload.id
              },
              TableName: productTableName,
            },
          },
          {
            Put: { 
              Item: {
                count: payload.count,
                product_id: payload.id
              },
              TableName: stocksTableName,
            },
          },
          ],
        })
}