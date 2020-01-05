export interface FormattedOrderBookRecord {
  price: string;
  poloniexQuantity: number;
  bittrexQuantity: number;
  combinedQuantity: number;
}

export interface CombinedOrderBookResponse {
  asks: FormattedOrderBookRecord[];
  bids: FormattedOrderBookRecord[];
}

export interface CombinedOrderBookRecord {
  [x: string] : {
    poloniexQuantity: number;
    bittrexQuantity: number;
  }
}

