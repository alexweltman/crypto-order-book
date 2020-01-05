export interface PoloniexRecord {
  [key: string] : number;
}

export interface PoloniexResponse {
  asks: any[];
  bids: any[];
  isFrozen: string;
  seq: number;
}
