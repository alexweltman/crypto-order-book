export interface BittrexRecord {
  Quantity: number,
  Rate: number
}

export interface BittrexResponse {
  success: boolean;
  message: string;
  result: {
    buy: BittrexRecord[];
    sell: BittrexRecord[];
  };
}
