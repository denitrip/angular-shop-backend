export interface Product {
    /** Available count */
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
  }

  export interface ProductDB {
    description: string;
    id: string;
    price: number;
    title: string;
  }

  export interface StockDB {
    count: number;
    product_id: string;
  }