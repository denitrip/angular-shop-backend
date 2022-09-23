import { writeFileSync } from 'fs';
import { productList } from '../../src/constants'
import type { Product } from '../../src/types'

const createProductsMock = () => {
    const productsMockObj = {
        "products": productList.map((product: Product) => {
            return {
                "PutRequest": {
                    "Item": {
                        "id": {
                            "N": product.id
                        },
                        "description": {
                            "S": product.description
                          },
                            "price": {
                            "S": String(product.price)
                          },
                            "title": {
                            "S": product.title
                          }
                    }
                }
            }
        })
    };
    writeFileSync('db/mocks/productsMock.json', JSON.stringify(productsMockObj));
}

const createStocksMock = () => {
    const stocksMockObj = {
        "stocks": productList.map((product: Product) => {
            return {
                "PutRequest": {
                    "Item": {
                        "product_id": {
                            "N": product.id
                        },
                        "count": {
                            "N": String(product.count)
                          },
                    }
                }
            }
        })
    };
    writeFileSync('db/mocks/stocksMock.json', JSON.stringify(stocksMockObj));
}

createProductsMock();
createStocksMock();