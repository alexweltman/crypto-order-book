interface Record {
  [key: string] : number;
}

export interface PoloniexResponse {
  asks: Record[];
  bids: Record[];
  isFrozen: string;
  seq: number;
}
